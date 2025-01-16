import React, { useState, useEffect } from 'react';
import { Play, Info } from 'lucide-react';
import { Movie } from '../../types/movie';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface MovieBannerProps {
  movies: Movie[];
}

export const MovieBanner: React.FC<MovieBannerProps> = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [movies.length]);

  if (!movies.length) return null;

  const currentMovie = movies[currentIndex];

  return (
    <div className="relative h-[85vh] min-h-[600px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img
            src={`https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`}
            alt={currentMovie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl"
          >
            <motion.h1
              key={`title-${currentMovie.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-5xl md:text-6xl font-bold text-white mb-4"
            >
              {currentMovie.title}
            </motion.h1>
            
            <motion.div
              key={`info-${currentMovie.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center gap-4 mb-4"
            >
              <span className="px-3 py-1.5 bg-red-600 text-white rounded-lg font-medium">
                {Math.round(currentMovie.vote_average * 10)}% Rating
              </span>
              <span className="text-gray-300 font-medium">
                {new Date(currentMovie.release_date).getFullYear()}
              </span>
              <div className="flex gap-2">
                {currentMovie.genres.slice(0, 3).map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1.5 bg-gray-800/80 text-white rounded-lg text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.p
              key={`overview-${currentMovie.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-lg text-gray-300 mb-8 line-clamp-3"
            >
              {currentMovie.overview}
            </motion.p>

            <motion.div
              key={`buttons-${currentMovie.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center gap-4"
            >
              <button 
                onClick={() => navigate(`/movie/${currentMovie.id}`)}
                className="px-8 py-4 bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors text-lg font-medium"
              >
                <Play className="w-6 h-6" fill="currentColor" />
                Watch Now
              </button>
              <button 
                onClick={() => navigate(`/movie/${currentMovie.id}`)}
                className="px-8 py-4 bg-gray-800/80 text-white rounded-lg flex items-center gap-2 hover:bg-gray-700 transition-colors text-lg font-medium"
              >
                <Info className="w-6 h-6" />
                More Info
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-red-600' : 'bg-gray-600 hover:bg-gray-500'
            }`}
          />
        ))}
      </div>
    </div>
  );
};