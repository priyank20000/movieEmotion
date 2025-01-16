import { Movie, Genre, Cast } from '../types/movie';

export const mockGenres: Genre[] = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' },
  { id: 27, name: 'Horror' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 53, name: 'Thriller' },
  { id: 99, name: 'Documentary' },
  { id: 9648, name: 'Mystery' }
];

const mockCast: Cast[] = [
  { id: 1, name: 'Tom Hanks', character: 'Forrest Gump', profile_path: '/8PHt7i3otJ2QjNLHEX1d7GqC8nN.jpg' },
  { id: 2, name: 'Robin Williams', character: 'John Keating', profile_path: '/1wkgUJF3p4Uu0nnHFm3m5GBUBuT.jpg' },
  { id: 3, name: 'Morgan Freeman', character: 'Red', profile_path: '/oIciQWr8VwKoR8TmAw1owaiZFyb.jpg' },
  { id: 4, name: 'Jim Carrey', character: 'Truman Burbank', profile_path: '/u0AqTz6Y7GHPCHINS01P7gPvDSb.jpg' },
  { id: 5, name: 'Will Smith', character: 'Chris Gardner', profile_path: '/6a6cl4ZNufJzrx5HZKWQ3PYyVWF.jpg' }
];

export const mockMovies: Movie[] = [
  {
    id: 1,
    title: 'The Pursuit of Happyness',
    overview: 'A struggling salesman takes custody of his son as he\'s poised to begin a life-changing professional career.',
    release_date: '2006-12-15',
    poster_path: '/lBYOKAE4pOXtBjDqcs10qVKuYny.jpg',
    vote_average: 8.0,
    genres: [mockGenres[4], mockGenres[6]],
    runtime: 117,
    director: 'Gabriele Muccino',
    cast: [mockCast[4]]
  },
  {
    id: 2,
    title: 'Dead Poets Society',
    overview: 'An English teacher inspires his students through poetry and the power of individuality.',
    release_date: '1989-06-02',
    poster_path: '/ai40gM7SUaGA6fthvsd87o8IQq4.jpg',
    vote_average: 8.4,
    genres: [mockGenres[4], mockGenres[3]],
    runtime: 128,
    director: 'Peter Weir',
    cast: [mockCast[1]]
  },
  {
    id: 3,
    title: 'The Truman Show',
    overview: 'An insurance salesman discovers his whole life is actually a reality TV show.',
    release_date: '1998-06-05',
    poster_path: '/vuza0WqY239yBXOadKlGwJsZJFE.jpg',
    vote_average: 8.1,
    genres: [mockGenres[3], mockGenres[4]],
    runtime: 103,
    director: 'Peter Weir',
    cast: [mockCast[3]]
  },
  {
    id: 4,
    title: 'Forrest Gump',
    overview: 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.',
    release_date: '1994-07-06',
    poster_path: '/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
    vote_average: 8.8,
    genres: [mockGenres[4], mockGenres[3], mockGenres[6]],
    runtime: 142,
    director: 'Robert Zemeckis',
    cast: [mockCast[0]]
  },
  {
    id: 5,
    title: 'The Shawshank Redemption',
    overview: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    release_date: '1994-09-23',
    poster_path: '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    vote_average: 8.7,
    genres: [mockGenres[4]],
    runtime: 142,
    director: 'Frank Darabont',
    cast: [mockCast[2]]
  }
];