import React from 'react';
import { Film, Play, Info, Tv, Ticket } from 'lucide-react';
import { Movie } from '../../types/movie';
import { motion } from 'framer-motion';

interface MovieCardProps {
  movie: Movie;
  isSelected?: boolean;
  onSelect?: (movie: Movie) => void;
  showBookingButton?: boolean;
  onBookNow?: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  isSelected,
  onSelect,
  showBookingButton = false,
  onBookNow
}) => {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  const handleClick = () => {
    if (onSelect) {
      onSelect(movie);
    }
  };

  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookNow?.(movie);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, zIndex: 1 }}
      className={`relative group ${isSelected ? 'ring-2 ring-red-600' : ''}`}
      onClick={handleClick}
    >
      <div className="relative bg-[#181818] rounded-md overflow-hidden cursor-pointer">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={movie.title}
            className="w-full aspect-[2/3] object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full aspect-[2/3] bg-gray-800 flex items-center justify-center">
            {movie.type === 'webseries' ? (
              <Tv className="w-12 h-12 text-gray-600" />
            ) : (
              <Film className="w-12 h-12 text-gray-600" />
            )}
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-semibold mb-2 line-clamp-2">{movie.title}</h3>
            
            <div className="flex items-center gap-2">
              <span className="text-green-500 font-semibold">
                {Math.round(movie.vote_average * 10)}%
              </span>
              <span className="text-sm text-gray-300">
                {new Date(movie.release_date).getFullYear()}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-3">
              {showBookingButton ? (
                <button
                  onClick={handleBookNow}
                  className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Ticket className="w-4 h-4" />
                  Book Now
                </button>
              ) : (
                <>
                  <button className="p-2 bg-white rounded-full hover:bg-white/90 transition-colors">
                    <Play className="w-4 h-4 text-black" fill="currentColor" />
                  </button>
                  <button className="p-2 bg-gray-600/80 rounded-full hover:bg-gray-600 transition-colors">
                    <Info className="w-4 h-4 text-white" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};