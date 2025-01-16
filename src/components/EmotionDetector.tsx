import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { AlertCircle, X, Camera } from 'lucide-react';
import { detectEmotion, type Emotion } from '../services/emotionService';

interface EmotionDetectorProps {
  onEmotionDetected: (emotion: Emotion) => void;
}

export const EmotionDetector: React.FC<EmotionDetectorProps> = ({ onEmotionDetected }) => {
  const webcamRef = useRef<Webcam>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [lastEmotion, setLastEmotion] = useState<Emotion | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  const handleCapture = async () => {
    if (!webcamRef.current) return;

    setError(null);

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        throw new Error('Failed to capture image');
      }

      const emotion = await detectEmotion(imageSrc);
      setLastEmotion(emotion);
      onEmotionDetected(emotion);
      setShowNotification(true);
    } catch (err) {
      setError('Failed to detect emotion. Please try again.');
      console.error('Emotion detection error:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => setShowNotification(false), 20000); // 20 seconds
      return () => clearTimeout(timer);
    }
  }, [showNotification]);



  return (
    <div className="relative w-full max-w-md mx-auto">
      <div
        style={{
          position: 'fixed',
          top: '200px', // Below the navbar
          right: '10px',
          backgroundColor: '#141414',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          zIndex: 1000,
          width: '70px', // Box size
          height: '70px', // Box size
          overflow: 'hidden', // Ensures the video fits within the box
          cursor: 'pointer' // Changes cursor to pointer on hover
        }}
      >
        <video
          src="https://res.cloudinary.com/dd1na5drh/video/upload/v1733038882/319148968595873794_online-video-cutter.com_koov2h.mp4" // Replace with your video path
          autoPlay
          loop
          muted
          className="w-full h-full object-cover hover:cursor-pointer" // Added hover cursor pointer
          onClick={() => setIsCapturing(true)} // Open popup on click
        />
      </div>

      {isCapturing && (
        <div className="fixed inset-0 bg-black/95 flex justify-center items-center z-50">
          <div className="bg-zinc-900 p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4 relative">
            <button 
              onClick={() => setIsCapturing(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white mb-4">Capture Your Emotion</h2>
              <Webcam
                ref={webcamRef}
                className="w-full rounded-lg shadow-lg"
                mirrored
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  width: 1280,
                  height: 720,
                  facingMode: 'user'
                }}
              />
              <button
                onClick={handleCapture}
                className="w-full px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Capture Emotion
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed top-24 right-4 p-4 bg-red-600/90 text-white rounded-lg shadow-lg max-w-sm animate-slide-left">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {showNotification && lastEmotion && (
        <div className="fixed top-24 right-4 p-4 bg-zinc-900/95 text-white rounded-lg shadow-lg max-w-sm animate-slide-left">
          <button 
            onClick={() => setShowNotification(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <p className="pr-6">
            Detected Emotion: <span className="text-red-500 font-medium">"{lastEmotion}"</span>
            <br />
            <span className="text-sm text-gray-300">
              Based on your mood, we suggest some movies for you!
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

// Add this to your global CSS or styled-components
const styles = `
  @keyframes slide-left {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .animate-slide-left {
    animation: slide-left 0.3s ease-out forwards;
  }
`;

// Inject styles into the document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}