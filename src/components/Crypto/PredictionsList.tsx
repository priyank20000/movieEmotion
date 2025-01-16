import React from 'react';
import { CryptoPredict } from '../../types/movie';
import { motion } from 'framer-motion';

interface PredictionsListProps {
  predictions: CryptoPredict[];
}

export const PredictionsList: React.FC<PredictionsListProps> = ({ predictions }) => {
  if (predictions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No predictions yet. Be the first to predict!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {predictions.map((prediction, index) => (
        <motion.div
          key={prediction.timestamp}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-800 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className={`text-sm font-medium ${
                prediction.prediction === 'yes' ? 'text-green-500' : 'text-red-500'
              }`}>
                Predicted: {prediction.prediction === 'yes' ? 'Success' : 'Not Success'}
              </span>
              <p className="text-white font-medium mt-1">
                Amount: ${prediction.amount}
              </p>
            </div>
            <span className="text-sm text-gray-400">
              {new Date(prediction.timestamp).toLocaleDateString()}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};