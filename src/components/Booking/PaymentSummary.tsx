import React, { useState } from 'react';
import { Movie } from '../../types/movie';
import { motion } from 'framer-motion';
import { Ticket, CreditCard, Smartphone, Wallet } from 'lucide-react';

interface PaymentSummaryProps {
  movie: Movie;
  bookingDetails: any;
  onComplete: () => void;
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  movie,
  bookingDetails,
  onComplete
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');

  const calculateTotal = () => {
    const basePrice = bookingDetails.seats.reduce((sum: number, seat: any) => sum + seat.price, 0);
    const gst = basePrice * 0.18; // 18% GST
    const convenienceFee = 30; // Fixed convenience fee
    return {
      basePrice,
      gst,
      convenienceFee,
      total: basePrice + gst + convenienceFee
    };
  };

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: Smartphone },
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'paytm', name: 'Paytm', icon: Wallet },
  ];

  const { basePrice, gst, convenienceFee, total } = calculateTotal();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Booking Summary</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between text-gray-300">
            <span>Movie</span>
            <span>{movie.title}</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Theater</span>
            <span>{bookingDetails.theater?.name}</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Show Time</span>
            <span>{bookingDetails.time}</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Format</span>
            <span>{bookingDetails.format?.type.toUpperCase()}</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Seats</span>
            <span>{bookingDetails.seats.map((seat: any) => seat.id).join(', ')}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Price Details</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between text-gray-300">
            <span>Base Price</span>
            <span>₹{basePrice}</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>GST (18%)</span>
            <span>₹{gst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Convenience Fee</span>
            <span>₹{convenienceFee}</span>
          </div>
          <div className="border-t border-gray-700 pt-4 flex justify-between text-white font-semibold">
            <span>Total Amount</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Select Payment Method</h3>
        
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedPaymentMethod(method.id)}
              className={`w-full p-4 rounded-lg flex items-center gap-4 transition-colors ${
                selectedPaymentMethod === method.id
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <method.icon className="w-6 h-6" />
              <span>{method.name}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onComplete}
        disabled={!selectedPaymentMethod}
        className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 ${
          selectedPaymentMethod
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
        }`}
      >
        <Ticket className="w-5 h-5" />
        Confirm Booking
      </button>
    </motion.div>
  );
};