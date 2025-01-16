import React from 'react';
import { DollarSign, Users, Film, Calendar } from 'lucide-react';
import { MovieDetails } from '../../types/movie';

interface MovieInfoProps {
  movie: MovieDetails;
}

export const MovieInfo: React.FC<MovieInfoProps> = ({ movie }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
          <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
        </div>

        {movie.cast && movie.cast.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">Cast</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {movie.cast.slice(0, 6).map(person => (
                <div key={person.id} className="flex items-center gap-3">
                  {person.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w92${person.profile_path}`}
                      alt={person.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                      <Users className="w-6 h-6 text-gray-600" />
                    </div>
                  )}
                  <div>
                    <p className="text-white font-medium">{person.name}</p>
                    <p className="text-sm text-gray-400">{person.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Details</h3>
          <div className="space-y-4">
            {movie.director && (
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400">Director:</span>
                <span className="text-white">{movie.director}</span>
              </div>
            )}
            {movie.genres && (
              <div className="flex items-center gap-3">
                <Film className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400">Genres:</span>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map(genre => (
                    <span
                      key={genre.id}
                      className="px-2 py-1 bg-gray-700 rounded-full text-sm text-white"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-gray-400">Release Date:</span>
              <span className="text-white">
                {new Date(movie.release_date).toLocaleDateString()}
              </span>
            </div>
            {movie.budget > 0 && (
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400">Budget:</span>
                <span className="text-white">{formatCurrency(movie.budget)}</span>
              </div>
            )}
            {movie.revenue > 0 && (
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400">Revenue:</span>
                <span className="text-white">{formatCurrency(movie.revenue)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};