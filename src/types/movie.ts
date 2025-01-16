export interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  genres: Genre[];
  runtime: number;
  cast: Cast[];
}

export interface MovieDetails extends Movie {
  budget: number;
  revenue: number;
  director?: string;
  trailers: MovieVideo[];
  images: MovieImage[];
  videos: MovieVideo[];
  reviews: MovieReview[];
}

export interface MovieReview {
  id: string;
  author: string;
  content: string;
  created_at: string;
  rating: number | null;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface MovieVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface MovieImage {
  path: string;
  aspectRatio: number;
}

export interface CryptoPredict {
  movieId: number;
  prediction: 'yes' | 'no';
  amount: number;
  userId: string;
  timestamp: number;
}