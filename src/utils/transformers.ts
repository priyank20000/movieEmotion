import { Movie, MovieDetails, Cast, Genre } from '../types/movie';

export const transformMovieResponse = (data: any): Movie => {
  return {
    id: data.id,
    title: data.title,
    overview: data.overview,
    release_date: data.release_date,
    poster_path: data.poster_path,
    vote_average: data.vote_average,
    genres: transformGenres(data.genres),
    runtime: data.runtime || 0,
    cast: transformCast(data.credits?.cast || [])
  };
};

export const transformGenres = (genres: any[]): Genre[] => {
  return genres?.map(genre => ({
    id: genre.id,
    name: genre.name
  })) || [];
};

export const transformCast = (cast: any[]): Cast[] => {
  return cast?.map(person => ({
    id: person.id,
    name: person.name,
    character: person.character,
    profile_path: person.profile_path
  })) || [];
};