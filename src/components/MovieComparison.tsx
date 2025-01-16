import React, { useEffect, useState } from 'react';
import { X, Star, Clock, Calendar, Film, Bot, Loader, ThumbsUp, ThumbsDown, ChevronDown, RefreshCw } from 'lucide-react';
import { Movie } from '../types/movie';
import { motion, AnimatePresence } from 'framer-motion';
import { compareMovies } from '../services/aiComparison';

interface MovieComparisonProps {
  movies: Movie[];
  onClose: () => void;
}

export const MovieComparison: React.FC<MovieComparisonProps> = ({ movies, onClose }) => {
  const [aiComparison, setAiComparison] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'comparison' | 'recommendation'>('comparison');
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<string>("Storytelling & Plot Analysis");
  const [retryCount, setRetryCount] = useState(0);
  const [failedAnalysis, setFailedAnalysis] = useState<number[]>([]);

  const analysisTabs = [
    "Storytelling & Plot Analysis",
    "Technical Elements",
    "Themes & Impact",
    "Audience & Reception",
    "Strengths & Weaknesses",
    "Final Recommendations",
    "AI Suggestion"
  ];

  const fetchAnalysis = async () => {
    setIsLoading(true);
    try {
      const comparison = await compareMovies(movies);
      setAiComparison(comparison);
      setFailedAnalysis([]);
    } catch (error) {
      console.error('Error comparing movies:', error);
      setAiComparison('Could not fetch comparison');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAnalysis();
  }, [movies, retryCount]);

  const handleRetry = (movieIndex: number) => {
    setRetryCount(prev => prev + 1);
    setFailedAnalysis(prev => [...prev, movieIndex]);
  };

  const compareFields = [
    {
      label: 'Release Date',
      value: (movie: Movie) => new Date(movie.release_date).toLocaleDateString(),
      icon: Calendar
    },
    {
      label: 'Rating',
      value: (movie: Movie) => `${movie.vote_average.toFixed(1)}/10`,
      icon: Star
    },
    {
      label: 'Runtime',
      value: (movie: Movie) => `${movie.runtime} minutes`,
      icon: Clock
    },
    {
      label: 'Genres',
      value: (movie: Movie) => (movie.genres?.map(g => g.name).join(', ') || 'Unknown'),
      icon: Film
    }
  ];

  const getMovieAnalysis = (text: string, movieIndex: number) => {
    const sections = text.split(/\d+\./);
    const currentSection = sections.find(section => 
      section.includes(activeAnalysisTab)
    );

    if (!currentSection) return 'Analysis not available';

    const movieLabel = `Movie ${movieIndex + 1}:`;
    const nextMovieLabel = movieIndex === 0 ? 'Movie 2:' : '\n\n';
    
    const movieContent = currentSection
      .split(movieLabel)[1]
      ?.split(nextMovieLabel)[0]
      ?.trim();

    return movieContent || 'Analysis not available';
  };

  const renderMovieAnalysis = (movie: Movie, index: number) => {
    const analysis = getMovieAnalysis(aiComparison, index);
    const hasValidAnalysis = analysis && analysis !== 'Analysis not available';

    return (
      <div 
        key={movie.id} 
        className="bg-gray-800/50 rounded-lg p-6 border border-gray-700"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-red-500' : 'bg-blue-500'}`} />
            <h4 className="text-lg font-semibold text-white">{movie.title}</h4>
          </div>
          {!hasValidAnalysis && !isLoading && (
            <button
              onClick={() => handleRetry(index)}
              className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Analysis
            </button>
          )}
        </div>
        
        {isLoading && failedAnalysis.includes(index) ? (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <Loader className="w-8 h-8 text-blue-400 animate-spin" />
            <p className="text-gray-400">Retrying analysis...</p>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <Loader className="w-8 h-8 text-blue-400 animate-spin" />
            <p className="text-gray-400">Analyzing movie...</p>
          </div>
        ) : (
          <p className="text-gray-300 leading-relaxed">
            {analysis}
          </p>
        )}
      </div>
    );
  };

  const AIRecommendationBox = ({ aiComparison }: { aiComparison: string }) => {
    const getAIRecommendation = () => {
      const suggestionSection = aiComparison
        .split(/\d+\./g)
        .find(section => section.includes('AI Suggestion'));

      const movieTypeSection = aiComparison
        .split(/\d+\./g)
        .find(section => section.includes('Movie Type'));

      if (!suggestionSection) return null;

      // Extract the better movie name from AI Suggestion
      const betterMovie = suggestionSection.trim();
      
      // Extract movie types from the Movie Type section
      const movieTypes = movieTypeSection?.split('\n')
        .filter(line => line.includes('Movie'))
        .map(line => {
          const type = line.split(':')[1]?.trim();
          return type;
        })
        .filter(Boolean) || [];

      return {
        recommendation: betterMovie,
        genres: movieTypes // Now using movie types instead of extracted genres
      };
    };

    const recommendation = getAIRecommendation();

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#141414] rounded-xl p-8 border border-gray-800 max-w-3xl mx-auto shadow-2xl"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-[#E50914]/30 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Bot className="w-8 h-8 text-[#E50914]" />
              </div>
            </div>
            <p className="text-gray-300 text-lg font-medium">AI is analyzing both movies...</p>
          </div>
        ) : !recommendation ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Unable to generate recommendation</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#E50914]/10 rounded-full">
                <Bot className="w-8 h-8 text-[#E50914]" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                AI's Final Verdict
              </h3>
            </div>

            <div className="w-full space-y-6">
              <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-[#E50914]/20">
                <div className="bg-[#E50914]/5 rounded-lg p-6 shadow-inner">
                  <p className="text-3xl font-bold text-white mb-2">
                    {recommendation.recommendation}
                  </p>
                  <div className="h-1 w-24 bg-[#E50914] mx-auto rounded-full mt-4" />
                </div>
              </div>

              {recommendation.genres.length > 0 && (
                <div className="bg-black/40 rounded-xl p-6 border border-gray-800">
                  <p className="text-[#E50914] font-medium mb-4 uppercase tracking-wider">
                    Featured Movie Types
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {recommendation.genres.map((type, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-[#E50914]/10 text-white rounded-md text-sm 
                                 border border-[#E50914]/20 hover:bg-[#E50914]/20 
                                 transition-colors duration-200"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-[#E50914] text-white rounded-md font-medium
                           hover:bg-[#E50914]/90 transition-colors duration-200
                           shadow-lg shadow-[#E50914]/20"
                >
                  Add to Watchlist
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  const renderAIAnalysis = () => {
    return (
      <div className="space-y-6">
        {/* Analysis Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-700 pb-2">
          {analysisTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveAnalysisTab(tab)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeAnalysisTab === tab
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Analysis Content */}
        <AnimatePresence mode="wait">
          {activeAnalysisTab === "AI Suggestion" ? (
            <AIRecommendationBox aiComparison={aiComparison} />
          ) : (
            <motion.div
              key={activeAnalysisTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {movies.map((movie, index) => renderMovieAnalysis(movie, index))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback Buttons */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            disabled={isLoading}
          >
            <ThumbsUp className="w-5 h-5" />
            Helpful Analysis
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            disabled={isLoading}
          >
            <ThumbsDown className="w-5 h-5" />
            Not Helpful
          </motion.button>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-7xl w-full bg-[#181818] rounded-lg overflow-hidden max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-[#181818] z-10 p-6 border-b border-gray-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-700/50 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <h2 className="text-2xl font-bold text-white mb-4">Movie Comparison</h2>

          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'comparison'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Compare Details
            </button>
            <button
              onClick={() => setActiveTab('recommendation')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'recommendation'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700'
              }`}
            >
              AI Analysis
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <AnimatePresence mode="wait">
            {activeTab === 'comparison' ? (
              <motion.div
                key="comparison"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {movies.map(movie => (
                  <motion.div
                    key={movie.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700"
                  >
                    <div className="relative aspect-video">
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path || movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-xl font-bold text-white mb-2">{movie.title}</h3>
                        <p className="text-gray-300 text-sm line-clamp-2">{movie.overview}</p>
                      </div>
                    </div>
                    <div className="p-4 space-y-3 bg-gray-800/30">
                      {compareFields.map(field => (
                        <div key={field.label} className="flex items-center gap-3">
                          <field.icon className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-400 min-w-[100px]">{field.label}:</span>
                          <span className="text-white">{field.value(movie)}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Bot className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-bold text-white">AI Analysis & Recommendation</h3>
                </div>
                {renderAIAnalysis()}
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};


