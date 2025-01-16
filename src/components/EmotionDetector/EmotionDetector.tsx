import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera, AlertCircle } from 'lucide-react';
import { detectEmotion, type Emotion } from '../../services/emotionService';
import { EmotionBadge } from './EmotionBadge';

interface EmotionDetectorProps {
  onEmotionDetected: (emotion: Emotion) => void;
}

export const EmotionDetector: React.FC<EmotionDetectorProps> = ({ onEmotionDetected }) => {
  const webcamRef = useRef<Webcam>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [lastEmotion, setLastEmotion] = useState<Emotion | null>(null);

  const handleCapture = async () => {
    if (!webcamRef.current) return;

    setIsCapturing(true);
    setError(null);

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        throw new Error('Failed to capture image');
      }

      const emotion = await detectEmotion(imageSrc);
      setLastEmotion(emotion);
      onEmotionDetected(emotion);
    } catch (err) {
      setError('Failed to detect emotion. Please try again.');
      console.error('Emotion detection error:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="rounded-lg overflow-hidden shadow-lg">
        <Webcam
          ref={webcamRef}
          className="w-full"
          mirrored
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            width: 640,
            height: 480,
            facingMode: 'user'
          }}
        />
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <button
        onClick={handleCapture}
        disabled={isCapturing}
        className={`mt-4 w-full px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
          isCapturing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
        }`}
      >
        <Camera className="w-5 h-5" />
        {isCapturing ? 'Detecting Emotion...' : 'Detect Emotion'}
      </button>

      {lastEmotion && <EmotionBadge emotion={lastEmotion} />}
    </div>
  );
};