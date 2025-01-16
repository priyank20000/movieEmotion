import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Theater, ShowFormat, Seat, getTheaterSeats } from '../../services/theaterService';

interface SeatSelectionProps {
  theater: Theater;
  format: ShowFormat;
  time: string;
  onSelectSeats: (seats: Seat[]) => void;
  onConfirm: () => void;
}

export const SeatSelection: React.FC<SeatSelectionProps> = ({
  theater,
  format,
  time,
  onSelectSeats,
  onConfirm
}) => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const theaterSeats = await getTheaterSeats(theater.id, theater.screens[0].id, time);
        setSeats(theaterSeats);
      } catch (error) {
        console.error('Error fetching seats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeats();
  }, [theater.id, time]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'taken') return;

    const isSelected = selectedSeats.some(s => s.id === seat.id);
    let newSelectedSeats: Seat[];

    if (isSelected) {
      newSelectedSeats = selectedSeats.filter(s => s.id !== seat.id);
    } else {
      if (selectedSeats.length >= 10) return;
      newSelectedSeats = [...selectedSeats, seat];
    }

    setSelectedSeats(newSelectedSeats);
    onSelectSeats(newSelectedSeats);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const rows = Array.from(new Set(seats.map(seat => seat.row))).sort();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="mb-6">
        <h3 className="text-lg font-medium text-white mb-2">
          {theater.name}
        </h3>
        <p className="text-gray-400">
          {format.type.toUpperCase()} • {time}
        </p>
      </div>

      <div className="mb-8 flex justify-center">
        <div className="w-2/3 h-2 bg-gray-300 rounded-lg mb-12"></div>
      </div>

      <div className="grid gap-2">
        {rows.map((row) => (
          <div key={row} className="flex items-center gap-2">
            <span className="w-6 text-gray-400 text-sm">{row}</span>
            <div className="flex gap-2 flex-1 justify-center">
              {seats
                .filter(seat => seat.row === row)
                .map((seat) => (
                  <motion.button
                    key={seat.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSeatClick(seat)}
                    className={`w-8 h-8 rounded ${
                      seat.status === 'taken' 
                        ? 'bg-gray-600 cursor-not-allowed opacity-50'
                        : selectedSeats.some(s => s.id === seat.id)
                        ? 'bg-green-500'
                        : seat.type === 'premium'
                        ? 'bg-purple-600'
                        : seat.type === 'recliner'
                        ? 'bg-yellow-600'
                        : 'bg-blue-600'
                    } hover:opacity-80 transition-colors`}
                    disabled={seat.status === 'taken'}
                  >
                    <span className="text-xs text-white">{seat.number}</span>
                  </motion.button>
                ))}
            </div>
            <span className="w-6 text-gray-400 text-sm">{row}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-600 rounded"></div>
          <span className="text-sm text-gray-400">Standard (₹200)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-600 rounded"></div>
          <span className="text-sm text-gray-400">Premium (₹300)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-600 rounded"></div>
          <span className="text-sm text-gray-400">Recliner (₹400)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-600 rounded"></div>
          <span className="text-sm text-gray-400">Taken</span>
        </div>
      </div>

      {selectedSeats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4"
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-white">
                Selected Seats: {selectedSeats.map(s => s.id).join(', ')}
              </p>
              <p className="text-gray-400">
                Total: ₹{selectedSeats.reduce((sum, seat) => sum + seat.price, 0)}
              </p>
            </div>
            <button 
              onClick={onConfirm}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Proceed to Payment
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};