import React from 'react';
import { X, Plus } from 'lucide-react';
import { Movie } from '../types/movie';
import { motion, AnimatePresence } from 'framer-motion';

interface MovieSelectionBarProps {
  show: boolean;
  selectedMovies: Movie[];
  onRemoveMovie: (movie: Movie) => void;
  onCancel: () => void;
  onCompare: () => void;
}

export const MovieSelectionBar: React.FC<MovieSelectionBarProps> = ({
  show,
  selectedMovies,
  onRemoveMovie,
  onCancel,
  onCompare,
}) => {
  if (!show) return null;

  const movieSlots = Array(4).fill(null).map((_, index) => selectedMovies[index] || null);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-[#141414] border-t border-gray-800 p-4 z-50"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            {movieSlots.map((movie, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <div className="text-red-500 font-bold">
                    <Plus className="w-6 h-6" />
                  </div>
                )}
                <div className={`w-24 h-36 bg-gray-800/50 rounded-md overflow-hidden border 
                  ${movie ? 'border-gray-700' : 'border-dashed border-gray-700'}`}
                >
                  {movie ? (
                    <div className="relative group">
                      <img
                        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onRemoveMovie(movie)}
                          className="absolute top-1 right-1 p-1.5 bg-red-600 rounded-full"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-xs text-white line-clamp-2">{movie.title}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-2">
                      <Plus className="w-6 h-6" />
                      <span className="text-xs text-center">
                        Select Movie {index + 1}
                      </span>
                    </div>
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-4">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onCompare}
                disabled={selectedMovies.length < 2}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  selectedMovies.length >= 2
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                Compare Movies ({selectedMovies.length})
              </button>
            </div>
            <p className="text-sm text-gray-500">
              Select 2-4 movies to compare
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};