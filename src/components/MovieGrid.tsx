import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../types/movie';
import { MovieCard } from './MovieCard';
import { MovieComparison } from './MovieComparison';
import { MovieSelectionBar } from './MovieSelectionBar';
import { Emotion } from '../services/emotionService';

interface MovieGridProps {
  movies: Movie[];
  currentEmotion: Emotion | null;
  onMovieSelect: (movie: Movie) => void;
  selectedMovies: Movie[];
}

export const MovieGrid: React.FC<MovieGridProps> = ({ movies, currentEmotion, onMovieSelect, selectedMovies }) => {
  const navigate = useNavigate();
  const [compareMovies, setCompareMovies] = useState<Movie[]>([]);
  const [showSelectionBar, setShowSelectionBar] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);

  const handleMovieClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
  };

  const handleCompare = (movie: Movie) => {
    if (!showSelectionBar) {
      setShowSelectionBar(true);
    }
    
    if (compareMovies.find(m => m.id === movie.id)) {
      setCompareMovies(compareMovies.filter(m => m.id !== movie.id));
      if (compareMovies.length === 1) {
        setShowSelectionBar(false);
      }
    } else if (compareMovies.length < 4) {
      const newCompareMovies = [...compareMovies, movie];
      setCompareMovies(newCompareMovies);
      
      if (newCompareMovies.length === 4) {
        setShowComparisonModal(true);
        setShowSelectionBar(false);
      }
    }
  };

  const handleCancelComparison = () => {
    setCompareMovies([]);
    setShowSelectionBar(false);
  };

  const handleStartComparison = () => {
    if (compareMovies.length >= 2) {
      setShowComparisonModal(true);
      setShowSelectionBar(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
        {Array.isArray(movies) && movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onSelect={() => handleMovieClick(movie)}
            onCompare={() => handleCompare(movie)}
            isSelected={compareMovies.some(m => m.id === movie.id)}
          />
        ))}
      </div>

      {/* Selection Bar */}
      <MovieSelectionBar
        show={showSelectionBar}
        selectedMovies={compareMovies}
        onRemoveMovie={(movie) => handleCompare(movie)}
        onCancel={handleCancelComparison}
        onCompare={handleStartComparison}
      />

      {/* Compare Modal */}
      
      {showComparisonModal && (
        <MovieComparison
          movies={compareMovies}
          onClose={() => {
            setCompareMovies([]);
            setShowSelectionBar(false);
            setShowComparisonModal(false);
          }}
        />
      )}
    </div>
  );
};
