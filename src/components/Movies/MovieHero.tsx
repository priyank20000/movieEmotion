import React from 'react';
import { Play, Star } from 'lucide-react';
import { MovieDetails } from '../../types/movie';
import { motion } from 'framer-motion';

interface MovieHeroProps {
  movie: MovieDetails;
}

export const MovieHero: React.FC<MovieHeroProps> = ({ movie }) => {
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  return (
    <div className="relative h-[70vh] min-h-[600px]">
      {backdropUrl && (
        <div className="absolute inset-0">
          <img
            src={backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
        </div>
      )}

      <div className="absolute inset-0 flex items-end">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {movie.title}
            </h1>

            <div className="flex items-center gap-4 text-gray-300 mb-6">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-500 mr-1" fill="currentColor" />
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
              <span>{new Date(movie.release_date).getFullYear()}</span>
              {movie.runtime > 0 && (
                <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
              )}
            </div>

            <p className="text-lg text-gray-300 mb-8 line-clamp-3">
              {movie.overview}
            </p>

            <div className="flex items-center gap-4">
              <button className="px-6 py-3 bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors">
                <Play className="w-5 h-5" fill="currentColor" />
                Watch Now
              </button>
              <button className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Add to Watchlist
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};