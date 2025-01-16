import React, { useState } from 'react';
import { 
  Star, Calendar, Globe, Languages, Film, Clock, DollarSign, 
  Award, ExternalLink, Play, Info, ThumbsUp, Share2, Plus,
  Facebook, Twitter, Instagram
} from 'lucide-react';
import { MovieDetails as MovieDetailsType } from '../../types/movie';
import ReactPlayer from 'react-player/lazy';
import { motion, AnimatePresence } from 'framer-motion';

interface MovieDetailsProps {
  movie: MovieDetailsType;
}

export const MovieDetails: React.FC<MovieDetailsProps> = ({ movie }) => {
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'media'>('overview');
  const trailer = movie.trailers[0];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'reviews', label: 'Reviews & Ratings' },
    { id: 'media', label: 'Media' }
  ] as const;

  return (
    <div className="bg-[#141414]">
      {/* Hero Section */}
      <div className="relative h-screen">
        <div className="absolute inset-0">
          {!isTrailerPlaying && movie.backdrop_path && (
            <img
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          )}
          {isTrailerPlaying && trailer && (
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${trailer.key}`}
              width="100%"
              height="100%"
              playing={isTrailerPlaying}
              controls
              onEnded={() => setIsTrailerPlaying(false)}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent" />
        </div>

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
                {movie.title}
              </h1>

              <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500" fill="currentColor" />
                  <span className="text-2xl font-bold text-white">{movie.vote_average.toFixed(1)}</span>
                  <span className="text-lg text-gray-400">/10</span>
                </div>
                <div className="h-6 w-px bg-gray-600" />
                <span className="text-lg text-gray-300">{movie.runtime} min</span>
                <div className="h-6 w-px bg-gray-600" />
                <span className="text-lg text-gray-300">
                  {new Date(movie.release_date).getFullYear()}
                </span>
              </div>

              <div className="flex flex-wrap gap-3 mb-8">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-4 py-1.5 bg-red-600/20 border border-red-600/50 text-red-500 rounded-full text-sm font-medium"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                {movie.overview}
              </p>

              <div className="flex items-center gap-4">
                {trailer && (
                  <button
                    onClick={() => setIsTrailerPlaying(true)}
                    className="px-8 py-4 bg-red-600 text-white rounded-lg flex items-center gap-3 hover:bg-red-700 transition-colors text-lg font-medium"
                  >
                    <Play className="w-6 h-6" fill="currentColor" />
                    Play Trailer
                  </button>
                )}
                <button className="p-4 bg-white/20 hover:bg-white/30 transition-colors rounded-full">
                  <Plus className="w-6 h-6 text-white" />
                </button>
                <button className="p-4 bg-white/20 hover:bg-white/30 transition-colors rounded-full">
                  <ThumbsUp className="w-6 h-6 text-white" />
                </button>
                <button className="p-4 bg-white/20 hover:bg-white/30 transition-colors rounded-full">
                  <Share2 className="w-6 h-6 text-white" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-8 border-b border-gray-800 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-lg font-medium transition-colors relative ${
                activeTab === tab.id ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-red-600"
                />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-12"
            >
              {/* Cast & Crew */}
              <div className="lg:col-span-2 space-y-12">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Top Cast</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {movie.cast.slice(0, 6).map((person) => (
                      <div key={person.id} className="group">
                        {person.profile_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
                            alt={person.name}
                            className="w-full aspect-[2/3] object-cover rounded-lg mb-3 group-hover:opacity-75 transition-opacity"
                          />
                        ) : (
                          <div className="w-full aspect-[2/3] bg-gray-800 rounded-lg mb-3" />
                        )}
                        <h3 className="text-white font-medium group-hover:text-red-500 transition-colors">
                          {person.name}
                        </h3>
                        <p className="text-gray-400 text-sm">{person.character}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Storyline</h2>
                  <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
                </div>
              </div>

              {/* Movie Info Sidebar */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Movie Info</h3>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-gray-400">Release Date</dt>
                      <dd className="text-white">
                        {new Date(movie.release_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-400">Runtime</dt>
                      <dd className="text-white">
                        {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-400">Budget</dt>
                      <dd className="text-white">{formatCurrency(movie.budget)}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-400">Revenue</dt>
                      <dd className="text-white">{formatCurrency(movie.revenue)}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-400">Production Companies</dt>
                      <dd className="text-white">Warner Bros., Universal Pictures</dd>
                    </div>
                    <div>
                      <dt className="text-gray-400">Languages</dt>
                      <dd className="text-white">English, Hindi</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Social</h3>
                  <div className="flex gap-4">
                    <a href="#" className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                      <Facebook className="w-5 h-5 text-white" />
                    </a>
                    <a href="#" className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                      <Twitter className="w-5 h-5 text-white" />
                    </a>
                    <a href="#" className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                      <Instagram className="w-5 h-5 text-white" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {movie.reviews?.map((review) => (
                <div key={review.id} className="bg-gray-800/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white font-medium">{review.author}</h3>
                      <p className="text-gray-400 text-sm">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 rounded-full">
                      <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                      <span className="text-yellow-500 font-medium">{review.rating}/10</span>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{review.content}</p>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'media' && (
            <motion.div
              key="media"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Videos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {movie.videos.map((video) => (
                    <div key={video.id} className="aspect-video bg-gray-800 rounded-lg overflow-hidden relative">
                      <ReactPlayer
                        url={`https://www.youtube.com/watch?v=${video.key}`}
                        width="100%"
                        height="100%"
                        light={true}
                        controls={true}
                        playIcon={
                          <button className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/70 transition-colors">
                            <Play className="w-16 h-16 text-white" />
                          </button>
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {movie.images.map((image, index) => (
                    <img
                      key={index}
                      src={image.path}
                      alt={`Scene ${index + 1}`}
                      className="w-full aspect-video object-cover rounded-lg hover:opacity-75 transition-opacity cursor-pointer"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};