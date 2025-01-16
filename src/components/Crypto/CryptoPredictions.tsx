import React, { useState } from 'react';
import { TrendingUp, DollarSign } from 'lucide-react';
import { PredictionForm } from './PredictionForm';
import { PredictionsList } from './PredictionsList';
import { CryptoStats } from './CryptoStats';
import { CryptoPredict } from '../../types/movie';

export const CryptoPredictions: React.FC = () => {
  const [predictions, setPredictions] = useState<CryptoPredict[]>([]);

  const handleNewPrediction = (prediction: CryptoPredict) => {
    setPredictions([prediction, ...predictions]);
  };

  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-6 w-6 text-green-500" />
        <h2 className="text-xl font-semibold text-white">Movie Success Predictions</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <PredictionForm onSubmit={handleNewPrediction} />
          <PredictionsList predictions={predictions} />
        </div>
        <div>
          <CryptoStats predictions={predictions} />
        </div>
      </div>
    </div>
  );
};