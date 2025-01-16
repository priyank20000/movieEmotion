import React from 'react';
import { MapPin, Star, Clock } from 'lucide-react';
import { Theater, ShowFormat } from '../../services/theaterService';
import { motion } from 'framer-motion';

interface TheaterListProps {
  theaters: Theater[];
  onSelectShow: (theater: Theater, format: ShowFormat, time: string) => void;
}

export const TheaterList: React.FC<TheaterListProps> = ({ theaters, onSelectShow }) => {
  return (
    <div className="space-y-6">
      {theaters.map((theater) => (
        <motion.div
          key={theater.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-lg p-6"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">{theater.name}</h3>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{theater.address}</span>
                <span>•</span>
                <span>{theater.distance.toFixed(1)} km away</span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-green-600/20 text-green-500 px-2 py-1 rounded">
              <Star className="w-4 h-4 fill-current" />
              <span>{theater.ratings}</span>
            </div>
          </div>

          {theater.screens.map((screen) => (
            <div key={screen.id} className="space-y-4">
              {screen.formats.map((format) => (
                <div key={format.type} className="border-t border-gray-700 pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-white font-medium capitalize">
                      {format.type === 'standard' ? '2D' : format.type.toUpperCase()}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-400">₹{format.price}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {format.showTimes.map((time) => (
                      <button
                        key={time}
                        onClick={() => onSelectShow(theater, format, time)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
                      >
                        <Clock className="w-4 h-4" />
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};