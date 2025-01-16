import React from 'react';
import { Movie } from '../../types/movie';
import { Emotion } from '../../services/emotionService';
import { MovieCard } from './MovieCard';
import { motion } from 'framer-motion';
import { getMoviesByEmotion } from '../../services/movieRecommendations';

interface MovieGridProps {
  movies: Movie[];
  currentEmotion: Emotion | null;
}

export const MovieGrid: React.FC<MovieGridProps> = ({ movies, currentEmotion }) => {
  const displayedMovies = currentEmotion && movies 
    ? getMoviesByEmotion(movies, currentEmotion)
    : movies;

  return (
    <motion.div 
      layout
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
    >
      {displayedMovies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </motion.div>
  );
};