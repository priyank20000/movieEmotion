import React from 'react';
import { Movie } from '../../types/movie';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface MovieGalleryProps {
  movie: Movie;
  onContinue: () => void;
}

export const MovieGallery: React.FC<MovieGalleryProps> = ({ movie, onContinue }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="aspect-video rounded-lg overflow-hidden">
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        {movie.images?.slice(0, 4).map((image, index) => (
          <div key={index} className="aspect-video rounded-lg overflow-hidden">
            <img
              src={image.path}
              alt={`${movie.title} scene ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Movie Details</h3>
        <div className="grid grid-cols-2 gap-4 text-gray-300">
          <div>
            <p className="text-gray-400">Release Date</p>
            <p>{new Date(movie.release_date).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-400">Duration</p>
            <p>{movie.runtime} minutes</p>
          </div>
          <div>
            <p className="text-gray-400">Genre</p>
            <p>{movie.genres.map(g => g.name).join(', ')}</p>
          </div>
          <div>
            <p className="text-gray-400">Rating</p>
            <p>{movie.vote_average.toFixed(1)}/10</p>
          </div>
        </div>
      </div>

      <button
        onClick={onContinue}
        className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
      >
        Continue to Select Theater
        <ChevronRight className="w-5 h-5" />
      </button>
    </motion.div>
  );
};