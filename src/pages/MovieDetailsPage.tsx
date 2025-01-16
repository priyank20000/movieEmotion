import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMovieDetails } from '../services/api';
import { MovieDetails } from '../components/Movies/MovieDetails';

export const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: movie, isLoading } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => getMovieDetails(Number(id)),
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <p className="text-xl text-gray-400">Movie not found</p>
      </div>
    );
  }

  return <MovieDetails movie={movie} />;
};