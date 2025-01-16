import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPopularMovies, searchMovies } from '../services/api';
import { MovieGrid } from '../components/MovieGrid';
import { SearchBar } from '../components/SearchBar';
import { EmotionDetector } from '../components/EmotionDetector';
import { MovieComparison } from '../components/MovieComparison';
import { MovieSelectionBar } from '../components/MovieSelectionBar';
import { Smile } from 'lucide-react';
import type { Emotion } from '../services/emotionService';
import type { Movie } from '../types/movie';

export const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentEmotion, setCurrentEmotion] = useState<Emotion | null>(null);
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['movies', searchQuery],
    queryFn: () => searchQuery ? searchMovies(searchQuery) : getPopularMovies(),
  });

  const movies = data?.movies || [];

  const handleEmotionDetected = (emotion: Emotion) => {
    setCurrentEmotion(emotion);
  };

  const handleMovieSelect = (movie: Movie) => {
    if (selectedMovies.find(m => m.id === movie.id)) {
      setSelectedMovies(selectedMovies.filter(m => m.id !== movie.id));
    } else if (selectedMovies.length < 2) {
      setSelectedMovies([...selectedMovies, movie]);
    }
  };

  const handleCompareMovies = () => {
    if (selectedMovies.length === 2) {
      setShowComparison(true);
    }
  };

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 pt-24 pb-24 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
          </div>
          <EmotionDetector onEmotionDetected={handleEmotionDetected} />
        </div>


        <div className="mb-8">
          <SearchBar 
            onSearch={setSearchQuery}
            onCompareMovies={movies => {
              setSelectedMovies(movies);
              setShowComparison(true);
            }}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <MovieGrid 
            movies={movies} 
            currentEmotion={currentEmotion}
            onMovieSelect={handleMovieSelect}
            selectedMovies={selectedMovies}
          />
        )}

        {showComparison && (
          <MovieComparison
            movies={selectedMovies}
            onClose={() => {
              setShowComparison(false);
              setSelectedMovies([]);
            }}
          />
        )}
      </main>

      {selectedMovies.length > 0 && (
        <MovieSelectionBar
          selectedMovies={selectedMovies}
          onRemoveMovie={(movieId) => {
            setSelectedMovies(selectedMovies.filter(m => m.id !== movieId));
          }}
          onCompare={handleCompareMovies}
        />
      )}
    </>
  );
};