import React from 'react';
import { Film, Play, Info, SplitSquareVertical } from 'lucide-react';
import { Movie } from '../types/movie';
import { motion } from 'framer-motion';

interface MovieCardProps {
  movie: Movie;
  onSelect?: () => void;
  onCompare?: () => void;
  isSelected?: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onSelect, onCompare, isSelected }) => {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative group"
    >
      <div 
        onClick={onSelect} 
        className="relative aspect-[2/3] rounded-lg overflow-hidden cursor-pointer"
      >
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={movie.title}
            className="w-full aspect-[2/3] object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full aspect-[2/3] bg-gray-800 flex items-center justify-center">
            <Film className="w-12 h-12 text-gray-600" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-semibold mb-2 line-clamp-2">{movie.title}</h3>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="text-green-500 font-semibold">
                  {Math.round(movie.vote_average * 10)}%
                </span>
                <span className="text-sm text-gray-300">
                  {new Date(movie.release_date).getFullYear()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <button className="p-2 bg-white rounded-full hover:bg-white/90 transition-colors">
                <Play className="w-4 h-4 text-black" fill="currentColor" />
              </button>
              <button className="p-2 bg-gray-600/80 rounded-full hover:bg-gray-600 transition-colors">
                <Info className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Compare Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onCompare?.();
        }}
        className={`absolute top-2 right-2 p-2 rounded-full 
                   ${isSelected 
                     ? 'bg-red-600 text-white' 
                     : 'bg-black/50 text-gray-300 hover:bg-red-600/50'
                   } 
                   transition-colors duration-200`}
      >
        <SplitSquareVertical className="w-4 h-4" />
      </button>

      {/* Movie Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white truncate">{movie.title}</h3>
        <p className="text-sm text-gray-400">{new Date(movie.release_date).getFullYear()}</p>
      </div>
    </motion.div>
  );
};