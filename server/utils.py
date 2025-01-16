import cv2
import numpy as np
from PIL import Image
import io
import base64
import logging

logger = logging.getLogger(__name__)

def decode_image(base64_image: str) -> np.ndarray:
    """Convert base64 image to OpenCV format with improved error handling."""
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