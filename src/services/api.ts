import axios from 'axios';
import { Movie, MovieDetails, MovieVideo, MovieImage } from '../types/movie';

const TMDB_API_KEY = '3c26bf3d991a242b76b609c4c3523949';
const BASE_URL = 'https://api.themoviedb.org/3';

export const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

// const transformMovies = (movies: any[]): Movie[] => {
//   return movies.map(movie => ({
//     id: movie.id,
//     title: movie.title,
//     overview: movie.overview,
//     release_date: movie.release_date,
//     poster_path: movie.poster_path,
//     vote_average: movie.vote_average,
//     genres: movie.genres || [],
//     runtime: movie.runtime || 0,
//     cast: []
//   }));
// };

// const transformMovieDetails = (movie: any, credits: any): MovieDetails => {
//   return {
//     id: movie.id,
//     title: movie.title,
//     overview: movie.overview,
//     release_date: movie.release_date,
//     poster_path: movie.poster_path,
//     backdrop_path: movie.backdrop_path,
//     vote_average: movie.vote_average,
//     genres: movie.genres || [],
//     runtime: movie.runtime || 0,
//     budget: movie.budget,
//     revenue: movie.revenue,
//     director: credits.crew.find((person: any) => person.job === 'Director')?.name,
//     cast: credits.cast.slice(0, 10).map((person: any) => ({
//       id: person.id,
//       name: person.name,
//       character: person.character,
//       profile_path: person.profile_path
//     })),
//     trailers: [],
//     images: [],
//     videos: []
//   };
// };

// export const getPopularMovies = async (): Promise<Movie[]> => {
//   try {
//     const response = await api.get('/movie/popular');
//     return transformMovies(response.data.results);
//   } catch (error) {
//     console.error('Error fetching popular movies:', error);
//     throw error;
//   }
// };

// export const searchMovies = async (query: string): Promise<Movie[]> => {
//   try {
//     const response = await api.get('/search/movie', {
//       params: { query }
//     });
//     return transformMovies(response.data.results);
//   } catch (error) {
//     console.error('Error searching movies:', error);
//     throw error;
//   }
// };

// export const getMovieDetails = async (id: number): Promise<MovieDetails> => {
//   try {
//     const [movieResponse, creditsResponse, videosResponse, imagesResponse] = await Promise.all([
//       api.get(`/movie/${id}`),
//       api.get(`/movie/${id}/credits`),
//       api.get(`/movie/${id}/videos`),
//       api.get(`/movie/${id}/images`)
//     ]);

//     const trailers = videosResponse.data.results.filter(
//       (video: MovieVideo) => video.type === 'Trailer' && video.site === 'YouTube'
//     );

//     const images = imagesResponse.data.backdrops.slice(0, 10).map((image: any) => ({
//       path: `https://image.tmdb.org/t/p/original${image.file_path}`,
//       aspectRatio: image.aspect_ratio
//     }));

//     return {
//       ...transformMovieDetails(movieResponse.data, creditsResponse.data),
//       trailers,
//       images,
//       videos: videosResponse.data.results
//     };
//   } catch (error) {
//     console.error('Error fetching movie details:', error);
//     throw error;
//   }
// };
// // Add these functions to your existing api.ts file

// export const getTopRatedMovies = async (): Promise<Movie[]> => {
//   try {
//     const response = await api.get('/movie/top_rated');
//     return transformMovies(response.data.results);
//   } catch (error) {
//     console.error('Error fetching top rated movies:', error);
//     throw error;
//   }
// };

// export const getUpcomingMovies = async (): Promise<Movie[]> => {
//   try {
//     const response = await api.get('/movie/upcoming');
//     return transformMovies(response.data.results);
//   } catch (error) {
//     console.error('Error fetching upcoming movies:', error);
//     throw error;
//   }
// };
// export const getMovieTrailer = async (movieId: number): Promise<string | null> => {
//   try {
//     const response = await api.get(`/movie/${movieId}/videos`);
//     const videos = response.data.results;
    
//     const trailer = videos.find((video: MovieVideo) => 
//       video.type === 'Trailer' && 
//       video.site === 'YouTube' &&
//       video.official
//     ) || videos.find((video: MovieVideo) => 
//       video.type === 'Trailer' && 
//       video.site === 'YouTube'
//     );

//     if (trailer) {
//       return `https://www.youtube.com/watch?v=${trailer.key}`;
//     }
//     return null;
//   } catch (error) {
//     console.error('Error fetching movie trailer:', error);
//     return null;
//   }
// };

/////////////////
const transformMovies = (movies: any[]): Movie[] => {
  return movies.map(movie => ({
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    release_date: movie.release_date,
    poster_path: movie.poster_path,
    backdrop_path: movie.backdrop_path,
    vote_average: movie.vote_average,
    genres: movie.genres || [],
    runtime: movie.runtime || 0,
    cast: []
  }));
};

export const getPopularMovies = async (page = 1): Promise<{ movies: Movie[], totalPages: number }> => {
  try {
    const response = await api.get('/movie/popular', {
      params: { page }
    });
    return {
      movies: transformMovies(response.data.results),
      totalPages: response.data.total_pages
    };
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

export const getTopRatedMovies = async (page = 1): Promise<{ movies: Movie[], totalPages: number }> => {
  try {
    const response = await api.get('/movie/top_rated', {
      params: { page }
    });
    return {
      movies: transformMovies(response.data.results),
      totalPages: response.data.total_pages
    };
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    throw error;
  }
};

export const getUpcomingMovies = async (page = 1): Promise<{ movies: Movie[], totalPages: number }> => {
  try {
    const response = await api.get('/movie/upcoming', {
      params: { page }
    });
    return {
      movies: transformMovies(response.data.results),
      totalPages: response.data.total_pages
    };
  } catch (error) {
    console.error('Error fetching upcoming movies:', error);
    throw error;
  }
};

export const getMovieDetails = async (id: number): Promise<MovieDetails> => {
  try {
    const [movieResponse, creditsResponse, videosResponse, imagesResponse, reviewsResponse] = await Promise.all([
      api.get(`/movie/${id}`),
      api.get(`/movie/${id}/credits`),
      api.get(`/movie/${id}/videos`),
      api.get(`/movie/${id}/images`),
      api.get(`/movie/${id}/reviews`)
    ]);

    const trailers = videosResponse.data.results.filter(
      (video: MovieVideo) => video.type === 'Trailer' && video.site === 'YouTube'
    );

    const images = imagesResponse.data.backdrops.slice(0, 10).map((image: any) => ({
      path: `https://image.tmdb.org/t/p/original${image.file_path}`,
      aspectRatio: image.aspect_ratio
    }));

    const reviews: MovieReview[] = reviewsResponse.data.results.map((review: any) => ({
      id: review.id,
      author: review.author,
      content: review.content,
      created_at: review.created_at,
      rating: review.author_details?.rating || null
    }));

    return {
      ...movieResponse.data,
      director: creditsResponse.data.crew.find((person: any) => person.job === 'Director')?.name,
      cast: creditsResponse.data.cast.slice(0, 10).map((person: any) => ({
        id: person.id,
        name: person.name,
        character: person.character,
        profile_path: person.profile_path
      })),
      trailers,
      images,
      videos: videosResponse.data.results,
      reviews
    };
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

export const searchMovies = async (query: string, page = 1): Promise<{ movies: Movie[], totalPages: number }> => {
  try {
    const response = await api.get('/search/movie', {
      params: { query, page }
    });
    return {
      movies: transformMovies(response.data.results),
      totalPages: response.data.total_pages
    };
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};
