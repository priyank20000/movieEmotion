import React, { useState, useEffect } from 'react';
import { X, MapPin, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Movie } from '../../types/movie';
import { Theater, ShowFormat, Seat } from '../../services/theaterService';
import { getCurrentLocation, getLocationDetails } from '../../services/locationService';
import { getNearbyTheaters, getTheaterSeats } from '../../services/theaterService';
import { TheaterList } from './TheaterList';
import { SeatSelection } from './SeatSelection';
import { PaymentSummary } from './PaymentSummary';
import { MovieGallery } from './MovieGallery';

interface BookingModalProps {
  movie: Movie;
  onClose: () => void;
}

type BookingStep = 'details' | 'theaters' | 'seats' | 'payment';

interface BookingDetails {
  theater?: Theater;
  format?: ShowFormat;
  time?: string;
  seats: Seat[];
}

export const BookingModal: React.FC<BookingModalProps> = ({ movie, onClose }) => {
  const [currentStep, setCurrentStep] = useState<BookingStep>('details');
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [location, setLocation] = useState<string | null>(null);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({ seats: [] });

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const coords = await getCurrentLocation();
        const locationDetails = await getLocationDetails(coords.latitude, coords.longitude);
        setLocation(locationDetails.city);
        
        const nearbyTheaters = await getNearbyTheaters(coords.latitude, coords.longitude);
        setTheaters(nearbyTheaters);
      } catch (error) {
        console.error('Error fetching location:', error);
        setLocation('Location not available');
      } finally {
        setIsLoadingLocation(false);
      }
    };

    fetchLocation();
  }, []);

  const handleShowSelection = async (theater: Theater, format: ShowFormat, time: string) => {
    setBookingDetails({ ...bookingDetails, theater, format, time });
    setCurrentStep('seats');
  };

  const handleSeatSelection = (selectedSeats: Seat[]) => {
    setBookingDetails({ ...bookingDetails, seats: selectedSeats });
  };

  const handlePaymentComplete = () => {
    // Handle payment completion
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-4xl bg-gray-900 rounded-lg overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gray-900 z-10 p-6 border-b border-gray-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <h2 className="text-2xl font-bold text-white mb-2">{movie.title}</h2>
          
          {isLoadingLocation ? (
            <div className="flex items-center gap-2 text-gray-400">
              <Loader className="w-4 h-4 animate-spin" />
              <span>Detecting location...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
          )}
        </div>

        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          <AnimatePresence mode="wait">
            {currentStep === 'details' && (
              <MovieGallery 
                movie={movie} 
                onContinue={() => setCurrentStep('theaters')} 
              />
            )}

            {currentStep === 'theaters' && (
              <TheaterList
                theaters={theaters}
                onSelectShow={handleShowSelection}
              />
            )}

            {currentStep === 'seats' && bookingDetails.theater && (
              <SeatSelection
                theater={bookingDetails.theater}
                format={bookingDetails.format!}
                time={bookingDetails.time!}
                onSelectSeats={handleSeatSelection}
                onConfirm={() => setCurrentStep('payment')}
              />
            )}

            {currentStep === 'payment' && (
              <PaymentSummary
                movie={movie}
                bookingDetails={bookingDetails}
                onComplete={handlePaymentComplete}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};