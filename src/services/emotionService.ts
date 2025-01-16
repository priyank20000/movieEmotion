import axios from 'axios';

export type Emotion = 'happy' | 'sad' | 'angry' | 'neutral' | 'surprised';

// Use environment variable for the server URL
const PYTHON_SERVER_URL = import.meta.env.PROD
  ? 'https://movie-emotion-api.herokuapp.com/detect-emotion'  // Deployed Python server URL
  : 'http://localhost:8000/detect-emotion';  // Local server URL for development

export const detectEmotion = async (imageData: string): Promise<Emotion> => {
  try {
    const response = await axios.post(
      PYTHON_SERVER_URL,
      { image: imageData },
      {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
        },
        validateStatus: (status) => status < 500,
      }
    );

    if (response.data && response.data.emotion) {
      console.log('Emotion detected:', response.data.emotion);
      return response.data.emotion as Emotion;
    }

    console.warn('Invalid response format:', response.data);
    return 'neutral';
  } catch (error) {
    console.error('Error detecting emotion:', error);
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        console.warn('Python server is not running');
      } else if (error.response) {
        console.warn('Server responded with error:', error.response.data);
      }
    }
    return 'neutral';
  }
};
