import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPopularMovies, getUpcomingMovies } from '../services/api';
import { MovieCard } from '../components/Movies/MovieCard';
import { BookingModal } from '../components/Booking/BookingModal';
import { Movie } from '../types/movie';
import { Tabs } from '../components/Layout/Tabs';
import { motion } from 'framer-motion';

export const TicketsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'now-showing' | 'upcoming'>('now-showing');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data: nowShowingMovies, isLoading: isLoadingNowShowing } = useQuery({
    queryKey: ['movies', 'now-showing'],
    queryFn: () => getPopularMovies()
  });

  const { data: upcomingMovies, isLoading: isLoadingUpcoming } = useQuery({
    queryKey: ['movies', 'upcoming'],
    queryFn: () => getUpcomingMovies()
  });

  const tabs = [
    { id: 'now-showing', label: 'Now Showing' },
    { id: 'upcoming', label: 'Coming Soon' }
  ];

  const handleBookNow = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  return (
    <div className="min-h-screen bg-black pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Movie Tickets</h1>
        
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as 'now-showing' | 'upcoming')}
          className="mb-8"
        />

        {activeTab === 'now-showing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {isLoadingNowShowing ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {nowShowingMovies?.movies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    showBookingButton={true}
                    onBookNow={handleBookNow}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'upcoming' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {isLoadingUpcoming ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {upcomingMovies?.movies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    showBookingButton={false}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {selectedMovie && (
        <BookingModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};