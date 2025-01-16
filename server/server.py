import logging
import json
from http.server import HTTPServer, SimpleHTTPRequestHandler
from deepface import DeepFace
import cv2
import numpy as np
from PIL import Image
import io
import base64

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Emotion Detection Logic using DeepFace
class EmotionDetector:
    def __init__(self):
        try:
            logger.info("EmotionDetector initialized successfully with DeepFace")
        except Exception as e:
            logger.error(f"Failed to initialize EmotionDetector: {str(e)}")
            raise

    def detect(self, image: np.ndarray):
        """Detect emotion from image"""
        try:
            # Save the image temporarily
            temp_image_path = "temp_image.jpg"
            cv2.imwrite(temp_image_path, image)

            # Use DeepFace for emotion analysis
            analysis = DeepFace.analyze(temp_image_path, actions=['emotion'])
            # Extract the dominant emotion
            dominant_emotion = analysis[0]['dominant_emotion']
            confidence = analysis[0]['emotion'][dominant_emotion]
            logger.info(f"Detected emotion: {dominant_emotion} with confidence: {confidence}")

            return dominant_emotion, confidence
        except Exception as e:
            logger.error(f"Error detecting emotion: {str(e)}")
            return 'neutral', 1.0

# Decode the base64 image data to OpenCV format
def decode_image(base64_image: str) -> np.ndarray:
    """Convert base64 image to OpenCV format."""
    try:
        # Remove data URL prefix if present
        if ',' in base64_image:
            image_data = base64_image.split(',')[1]
        else:
            image_data = base64_image

        # Decode base64
        image_bytes = base64.b64decode(image_data)
        
        # Convert to PIL Image
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if not already
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Convert to numpy array
        numpy_image = np.array(image)
        
        # Convert to BGR for OpenCV
        opencv_image = cv2.cvtColor(numpy_image, cv2.COLOR_RGB2BGR)
        
        logger.info("Image decoded successfully")
        return opencv_image
        
    except Exception as e:
        logger.error(f"Error decoding image: {str(e)}")
        raise

# HTTP Request Handler for Emotion Detection
class EmotionDetectionHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.emotion_detector = EmotionDetector()
        super().__init__(*args, **kwargs)

    def do_OPTIONS(self):
        """Handle OPTIONS request for CORS"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        """Handle POST request for emotion detection"""
        if self.path == '/detect-emotion':
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data.decode('utf-8'))
                
                if 'image' not in data:
                    raise ValueError("No image data provided")
                
                # Decode and process image
                image = decode_image(data['image'])
                emotion, confidence = self.emotion_detector.detect(image)
                
                logger.info(f"Detected emotion: {emotion} with confidence: {confidence}")
                
                # Prepare response
                response = json.dumps({
                    "emotion": emotion,
                    "confidence": confidence
                })
                
                # Send response
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(response.encode('utf-8'))
                
            except Exception as e:
                logger.error(f"Server error: {str(e)}")
                error_response = json.dumps({
                    "error": str(e),
                    "emotion": "neutral",
                    "confidence": 1.0
                })
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(error_response.encode('utf-8'))
            return

        self.send_response(404)
        self.end_headers()

# Run the HTTP server
def run_server(port=8000):
    try:
        server_address = ('', port)
        httpd = HTTPServer(server_address, EmotionDetectionHandler)
        logger.info(f'Starting server on port {port}...')
        httpd.serve_forever()
    except Exception as e:
        logger.error(f"Failed to start server: {str(e)}")
        raise

if __name__ == '__main__':
    run_server()
