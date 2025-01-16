import React, { useState, useRef, useEffect } from 'react';
import { Search, Scale } from 'lucide-react';
import { Movie } from '../types/movie';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onCompareMovies?: (movies: Movie[]) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onCompareMovies }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await api.get('/search/movie', {
          params: { query, page: 1 }
        });
        setSuggestions(response.data.results.slice(0, 5));
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (movie: Movie) => {
    if (isComparing) {
      if (selectedMovies.length < 3 && !selectedMovies.find(m => m.id === movie.id)) {
        setSelectedMovies([...selectedMovies, movie]);
      }
    } else {
      setQuery(movie.title);
      onSearch(movie.title);
      setShowSuggestions(false);
    }
  };

  const toggleCompareMode = () => {
    setIsComparing(!isComparing);
    if (!isComparing) {
      setSelectedMovies([]);
    }
  };

  const handleCompare = () => {
    if (selectedMovies.length >= 2) {
      onCompareMovies?.(selectedMovies);
      setIsComparing(false);
      setSelectedMovies([]);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder={isComparing ? "Select movies to compare..." : "Search for movies..."}
              className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-white/10 border border-gray-600 rounded-lg focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 placeholder-gray-400 text-white"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </form>

          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-50 w-full mt-2 bg-[#181818] border border-gray-700 rounded-lg shadow-xl overflow-hidden"
              >
                {suggestions.map((movie) => (
                  <div
                    key={movie.id}
                    className="flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer transition-colors"
                    onClick={() => handleSuggestionClick(movie)}
                  >
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                        alt={movie.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-16 bg-gray-800 rounded flex items-center justify-center">
                        <Search className="w-6 h-6 text-gray-500" />
                      </div>
                    )}
                    <div>
                      <p className="text-white font-medium">{movie.title}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(movie.release_date).getFullYear()}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={toggleCompareMode}
          className={`p-2 rounded-lg transition-colors ${
            isComparing 
              ? 'bg-red-600 text-white' 
              : 'bg-white/10 text-gray-400 hover:bg-white/20'
          }`}
          title="Compare movies"
        >
          <Scale className="w-5 h-5" />
        </button>
      </div>

      {isComparing && selectedMovies.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center gap-4 mb-2">
            <h3 className="text-white font-medium">Selected Movies:</h3>
            {selectedMovies.length >= 2 && (
              <button
                onClick={handleCompare}
                className="px-4 py-1 bg-red-600 text-white rounded-full text-sm hover:bg-red-700 transition-colors"
              >
                Compare ({selectedMovies.length})
              </button>
            )}
          </div>
          <div className="flex gap-2">
            {selectedMovies.map((movie) => (
              <div
                key={movie.id}
                className="relative bg-gray-800 rounded p-2 flex items-center gap-2"
              >
                {movie.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                    alt={movie.title}
                    className="w-8 h-12 object-cover rounded"
                  />
                )}
                <span className="text-white text-sm">{movie.title}</span>
                <button
                  onClick={() => setSelectedMovies(selectedMovies.filter(m => m.id !== movie.id))}
                  className="ml-2 text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};