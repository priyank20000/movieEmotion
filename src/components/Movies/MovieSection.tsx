import React, { useEffect, useRef, useCallback } from 'react';
import { Movie } from '../../types/movie';
import { MovieCard } from './MovieCard';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  onMovieSelect?: (movie: Movie) => void;
  selectedMovies?: Movie[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export const MovieSection: React.FC<MovieSectionProps> = ({
  title,
  movies,
  onMovieSelect,
  selectedMovies = [],
  isLoading,
  hasMore,
  onLoadMore
}) => {
  const observer = useRef<IntersectionObserver>();
  const lastMovieRef = useCallback((node: HTMLDivElement) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore?.();
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, onLoadMore]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <div className="relative">
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
        >
          {movies.map((movie, index) => (
            <div
              key={`${movie.id}-${index}`}
              ref={index === movies.length - 1 ? lastMovieRef : undefined}
            >
              <MovieCard
                movie={movie}
                isSelected={selectedMovies.some(m => m.id === movie.id)}
                onSelect={onMovieSelect}
              />
            </div>
          ))}
        </motion.div>
        
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <Loader className="w-8 h-8 text-red-600 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};