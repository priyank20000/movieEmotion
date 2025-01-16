import React, { useState } from 'react';
import { X, Star, DollarSign, TrendingUp, Users, MessageCircle, Film } from 'lucide-react';
import ReactPlayer from 'react-player';
import { Movie, Cast } from '../types/movie';
import { motion, AnimatePresence } from 'framer-motion';

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
  trailerUrl?: string;
}

export const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose, trailerUrl }) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'cast' | 'reviews'>('overview');
  const [selectedCastMember, setSelectedCastMember] = useState<Cast | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      <p className="text-gray-300 text-lg">{movie.overview}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {movie.budget && movie.revenue && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              <span className="text-gray-400">Budget: </span>
              <span className="text-white">{formatCurrency(movie.budget)}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-gray-400">Revenue: </span>
              <span className="text-white">{formatCurrency(movie.revenue)}</span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {movie.director && (
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-gray-400">Director: </span>
              <span className="text-white">{movie.director}</span>
            </div>
          )}
          {movie.genres && (
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-purple-500" />
              <span className="text-gray-400">Genres: </span>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map(genre => (
                  <span key={genre.id} className="px-2 py-1 bg-gray-800 rounded-full text-sm text-white">
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {movie.similar_movies && movie.similar_movies.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-white mb-4">Similar Movies</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {movie.similar_movies.map(similar => (
              <div key={similar.id} className="space-y-2">
                <img
                  src={`https://image.tmdb.org/t/p/w200${similar.poster_path}`}
                  alt={similar.title}
                  className="w-full rounded-md"
                />
                <p className="text-sm text-white font-medium line-clamp-2">{similar.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderCastTab = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {movie.cast.map(person => (
        <div
          key={person.id}
          className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors"
          onClick={() => setSelectedCastMember(person)}
        >
          <div className="flex items-center gap-4">
            {person.profile_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                alt={person.name}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <div>
              <h4 className="text-white font-medium">{person.name}</h4>
              <p className="text-gray-400 text-sm">{person.character}</p>
              {person.known_for_department && (
                <p className="text-gray-500 text-sm">{person.known_for_department}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderReviewsTab = () => (
    <div className="space-y-6">
      {movie.reviews && movie.reviews.length > 0 ? (
        movie.reviews.map(review => (
          <div key={review.id} className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-500" />
                <span className="text-white font-medium">{review.author}</span>
              </div>
              {review.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                  <span className="text-white">{review.rating}/10</span>
                </div>
              )}
            </div>
            <p className="text-gray-300">{review.content}</p>
            <p className="text-gray-500 text-sm mt-2">
              {new Date(review.created_at).toLocaleDateString()}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-center">No reviews available.</p>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-6xl w-full bg-[#181818] rounded-lg overflow-hidden my-8"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition-all"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <div className="relative aspect-video">
          {trailerUrl ? (
            <ReactPlayer
              url={trailerUrl}
              width="100%"
              height="100%"
              playing
              controls
            />
          ) : (
            <img
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h2 className="text-4xl font-bold text-white mb-4">{movie.title}</h2>
              <div className="flex items-center gap-4">
                <span className="text-green-500 font-semibold">
                  {Math.round(movie.vote_average * 10)}% Match
                </span>
                <span className="text-gray-400">
                  {new Date(movie.release_date).getFullYear()}
                </span>
                {movie.runtime && (
                  <span className="text-gray-400">{movie.runtime} min</span>
                )}
                {movie.imdb_id && (
                  <a
                    href={`https://www.imdb.com/title/${movie.imdb_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-500 hover:text-yellow-400 transition-colors"
                  >
                    IMDb
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4 border-b border-gray-700 mb-6">
            {(['overview', 'cast', 'reviews'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 text-lg capitalize ${
                  selectedTab === tab
                    ? 'text-white border-b-2 border-red-600'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {selectedTab === 'overview' && renderOverviewTab()}
          {selectedTab === 'cast' && renderCastTab()}
          {selectedTab === 'reviews' && renderReviewsTab()}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedCastMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-80 p-4"
            onClick={() => setSelectedCastMember(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-2xl w-full bg-[#181818] rounded-lg p-6"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedCastMember(null)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-700 rounded-full"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              <div className="flex gap-6">
                {selectedCastMember.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w300${selectedCastMember.profile_path}`}
                    alt={selectedCastMember.name}
                    className="w-48 h-48 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-48 h-48 rounded-lg bg-gray-700 flex items-center justify-center">
                    <Users className="w-16 h-16 text-gray-500" />
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedCastMember.name}</h3>
                  <p className="text-gray-400 mb-4">as {selectedCastMember.character}</p>
                  {selectedCastMember.biography && (
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {selectedCastMember.biography}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};