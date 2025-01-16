import { Movie } from '../types/movie';
import { Emotion } from './emotionService';

interface GenreWeight {
  name: string;
  weight: number;
}

const emotionGenreMap: Record<Emotion, GenreWeight[]> = {
  happy: [
    { name: 'Comedy', weight: 1.0 },
    { name: 'Animation', weight: 0.8 },
    { name: 'Adventure', weight: 0.7 },
    { name: 'Romance', weight: 0.6 },
    { name: 'Family', weight: 0.5 }
  ],
  sad: [
    { name: 'Drama', weight: 1.0 },
    { name: 'Romance', weight: 0.8 },
    { name: 'Documentary', weight: 0.6 },
    { name: 'Music', weight: 0.5 },
    { name: 'Animation', weight: 0.4 }
  ],
  angry: [
    { name: 'Action', weight: 1.0 },
    { name: 'Adventure', weight: 0.8 },
    { name: 'Science Fiction', weight: 0.7 },
    { name: 'Comedy', weight: 0.6 },
    { name: 'Sport', weight: 0.5 }
  ],
  surprised: [
    { name: 'Thriller', weight: 1.0 },
    { name: 'Mystery', weight: 0.9 },
    { name: 'Science Fiction', weight: 0.8 },
    { name: 'Adventure', weight: 0.7 },
    { name: 'Fantasy', weight: 0.6 }
  ],
  neutral: [
    { name: 'Action', weight: 0.8 },
    { name: 'Adventure', weight: 0.8 },
    { name: 'Comedy', weight: 0.8 },
    { name: 'Drama', weight: 0.8 },
    { name: 'Science Fiction', weight: 0.8 },
    { name: 'Romance', weight: 0.8 }
  ]
};

const calculateMovieScore = (movie: Movie, emotion: Emotion): number => {
  const relevantGenres = emotionGenreMap[emotion];
  let score = 0;
  let totalWeight = 0;

  // Calculate weighted score based on matching genres
  movie.genres.forEach(movieGenre => {
    const matchingGenre = relevantGenres.find(g => g.name === movieGenre.name);
    if (matchingGenre) {
      score += matchingGenre.weight;
      totalWeight += matchingGenre.weight;
    }
  });

  // Normalize score
  const genreScore = totalWeight > 0 ? score / totalWeight : 0;
  
  // Combine with vote average and release date for final score
  const currentYear = new Date().getFullYear();
  const movieYear = new Date(movie.release_date).getFullYear();
  const yearWeight = Math.max(0, 1 - (currentYear - movieYear) / 50); // Newer movies get slightly higher scores
  
  // Final score: 60% genre match, 25% rating, 15% release date
  const finalScore = (genreScore * 0.6) + ((movie.vote_average / 10) * 0.25) + (yearWeight * 0.15);
  
  return finalScore;
};

export const getMoviesByEmotion = (movies: Movie[], emotion: Emotion): Movie[] => {
  if (!movies || movies.length === 0) return [];

  // For neutral emotion, return a diverse mix of movies
  if (emotion === 'neutral') {
    return movies
      .sort((a, b) => b.vote_average - a.vote_average)
      .slice(0, 20)
      .sort(() => Math.random() - 0.5); // Shuffle the top rated movies
  }

  // Calculate scores and sort movies
  const scoredMovies = movies
    .map(movie => ({
      movie,
      score: calculateMovieScore(movie, emotion)
    }))
    .filter(item => item.score > 0.3) // Only keep movies with decent match
    .sort((a, b) => b.score - a.score);

  // Return top matches with some randomization for variety
  return scoredMovies
    .slice(0, Math.min(20, scoredMovies.length))
    .sort(() => Math.random() - 0.5)
    .map(item => item.movie);
};