import cv2
from fer import FER
import logging
from mtcnn import MTCNN
import numpy as np

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EmotionDetector:
    def __init__(self):
        try:
            # Initialize FER (with MTCNN for face detection) and MTCNN explicitly for better control
            self.detector = FER(mtcnn=True)
            self.face_detector = MTCNN()
            
            # Enhanced emotion mapping
            self.emotion_mapping = {
                'happy': 'happy',
                'sad': 'sad',
                'angry': 'angry',
                'fear': 'sad',  # Map fear to sad for better recommendations
                'surprise': 'surprised',
                'neutral': 'neutral',
                'disgust': 'angry'
            }
            logger.info("EmotionDetector initialized successfully with MTCNN")
        except Exception as e:
            logger.error(f"Failed to initialize EmotionDetector: {str(e)}")
            raise

    def preprocess_image(self, image):
        """Preprocess image for better detection"""
        try:
            # Ensure correct color format (RGB)
            if len(image.shape) == 2:
                image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
            elif image.shape[2] == 4:
                image = cv2.cvtColor(image, cv2.COLOR_RGBA2RGB)
            
            # Normalize the image to enhance contrast
            image = cv2.normalize(image, None, alpha=0, beta=255, 
                                norm_type=cv2.NORM_MINMAX)
            
            return image
        except Exception as e:
            logger.error(f"Error preprocessing image: {str(e)}")
            return image

    def detect(self, image: np.ndarray):
        """Enhanced emotion detection with multiple checks"""
        try:
            if image is None or not isinstance(image, np.ndarray):
                logger.error("Invalid image format")
                return 'neutral', 1.0

            # Preprocess image
            processed_image = self.preprocess_image(image)
            
            # Detect face using MTCNN
            faces = self.face_detector.detect_faces(processed_image)
            
            if not faces:
                logger.info("No face detected with MTCNN")
                return 'neutral', 1.0

            # Get the largest face (assumes largest face is the main face)
            face = max(faces, key=lambda x: x['box'][2] * x['box'][3])
            x, y, w, h = face['box']
            
            # Add margin around the face for better emotion detection
            margin = 40
            y_start = max(y - margin, 0)
            y_end = min(y + h + margin, processed_image.shape[0])
            x_start = max(x - margin, 0)
            x_end = min(x + w + margin, processed_image.shape[1])
            
            face_roi = processed_image[y_start:y_end, x_start:x_end]
            
            # Detect emotions on the extracted face ROI
            result = self.detector.detect_emotions(face_roi)
            
            if not result:
                logger.info("No emotions detected in the face")
                return 'neutral', 1.0

            # Get emotions and their corresponding confidence levels
            emotions = result[0]['emotions']
            emotion = max(emotions.items(), key=lambda x: x[1])[0]
            confidence = emotions[emotion]
            
            logger.info(f"Emotion confidence: {emotion} -> {confidence}")

            # Apply confidence threshold to avoid misclassification
            if confidence < 0.4:
                logger.info(f"Low confidence ({confidence}) for emotion: {emotion}, returning 'neutral'.")
                return 'neutral', 1.0
            
            # Map detected emotion to predefined categories (to make results more consistent)
            mapped_emotion = self.emotion_mapping.get(emotion, 'neutral')
            logger.info(f"Detected emotion: {emotion} -> Mapped to: {mapped_emotion} (confidence: {confidence})")
            
            return mapped_emotion, float(confidence)
            
        except Exception as e:
            logger.error(f"Error detecting emotion: {str(e)}")
            return 'neutral', 1.0


# Initialize webcam and emotion detector
cap = cv2.VideoCapture(0)  # Open the webcam (device 0)

if not cap.isOpened():
    logger.error("Could not open webcam")
else:
    emotion_detector = EmotionDetector()

    while True:
        # Read frame from webcam
        ret, frame = cap.read()

        if not ret:
            logger.error("Failed to capture frame")
            break

        # Detect emotion in the captured frame
        emotion, confidence = emotion_detector.detect(frame)

        # Display the emotion and confidence on the frame
        cv2.putText(frame, f"Emotion: {emotion} ({confidence * 100:.2f}%)", 
                    (20, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

        # Show the frame with detected emotion
        cv2.imshow("Emotion Detection", frame)

        # Break the loop if the user presses 'q'
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Release the webcam and close windows
    cap.release()
    cv2.destroyAllWindows()
