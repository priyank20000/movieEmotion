import React from 'react';
import { TrendingUp, Users, DollarSign } from 'lucide-react';
import { CryptoPredict } from '../../types/movie';

interface CryptoStatsProps {
  predictions: CryptoPredict[];
}

export const CryptoStats: React.FC<CryptoStatsProps> = ({ predictions }) => {
  const totalPredictions = predictions.length;
  const totalAmount = predictions.reduce((sum, p) => sum + p.amount, 0);
  const successPredictions = predictions.filter(p => p.prediction === 'yes').length;
  const successRate = totalPredictions > 0 ? (successPredictions / totalPredictions) * 100 : 0;

  const stats = [
    {
      label: 'Total Predictions',
      value: totalPredictions,
      icon: Users,
      color: 'text-blue-500'
    },
    {
      label: 'Total Amount',
      value: `$${totalAmount}`,
      icon: DollarSign,
      color: 'text-green-500'
    },
    {
      label: 'Success Rate',
      value: `${successRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Prediction Stats</h3>
      <div className="space-y-6">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-4">
            <div className={`p-3 rounded-lg bg-gray-700 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-400">{stat.label}</p>
              <p className="text-xl font-semibold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};