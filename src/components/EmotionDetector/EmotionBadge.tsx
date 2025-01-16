import React from 'react';
import { Emotion } from '../../services/emotionService';

interface EmotionBadgeProps {
  emotion: Emotion;
}

export const EmotionBadge: React.FC<EmotionBadgeProps> = ({ emotion }) => {
  const getEmotionColor = (emotion: Emotion) => {
    const colors = {
      happy: 'bg-green-100 text-green-800',
      sad: 'bg-blue-100 text-blue-800',
      angry: 'bg-red-100 text-red-800',
      surprised: 'bg-purple-100 text-purple-800',
      neutral: 'bg-gray-100 text-gray-800'
    };
    return colors[emotion];
  };

  return (
    <div className="mt-4 text-center">
      <span className={`px-4 py-2 rounded-full ${getEmotionColor(emotion)}`}>
        Detected Emotion: {emotion}
      </span>
    </div>
  );
};