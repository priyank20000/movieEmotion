import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';
import { CryptoPredict } from '../../types/movie';
import { createPrediction } from '../../services/crypto';

interface PredictionFormProps {
  onSubmit: (prediction: CryptoPredict) => void;
}

export const PredictionForm: React.FC<PredictionFormProps> = ({ onSubmit }) => {
  const [amount, setAmount] = useState<number>(100);
  const [prediction, setPrediction] = useState<'yes' | 'no'>('yes');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newPrediction: CryptoPredict = {
        movieId: 1, // This should come from the current movie context
        prediction,
        amount,
        userId: 'user123', // This should come from auth context
        timestamp: Date.now()
      };

      const predictionId = await createPrediction(newPrediction);
      onSubmit(newPrediction);
      setAmount(100);
      setPrediction('yes');
    } catch (error) {
      console.error('Error creating prediction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6 mb-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Prediction Amount
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={1}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Your Prediction
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPrediction('yes')}
              className={`px-4 py-2 rounded-lg ${
                prediction === 'yes'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Success
            </button>
            <button
              type="button"
              onClick={() => setPrediction('no')}
              className={`px-4 py-2 rounded-lg ${
                prediction === 'no'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Not Success
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 rounded-lg ${
            isSubmitting
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700'
          } text-white font-medium transition-colors`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Prediction'}
        </button>
      </div>
    </form>
  );
};