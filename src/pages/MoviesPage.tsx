import React, { useState } from 'react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { getPopularMovies, getTopRatedMovies, getUpcomingMovies } from '../services/api';
import { MovieBanner } from '../components/Movies/MovieBanner';
import { MovieSlider } from '../components/Movies/MovieSlider';
import { CategoryTabs } from '../components/Movies/CategoryTabs';
import { MovieSection } from '../components/Movies/MovieSection';
import { MovieComparison } from '../components/MovieComparison';
import { Movie } from '../types/movie';
import { useNavigate } from 'react-router-dom';

type Category = 'hollywood' | 'bollywood' | 'webseries';

interface MoviePage {
  movies: Movie[];
  totalPages: number;
}

export const MoviesPage: React.FC = () => {
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>('hollywood');
  const navigate = useNavigate();

  const { data: popularMovies } = useQuery({
    queryKey: ['movies', 'popular', activeCategory],
    queryFn: () => getPopularMovies(),
  });

  const { data: topRatedMovies } = useQuery({
    queryKey: ['movies', 'top-rated', activeCategory],
    queryFn: () => getTopRatedMovies(),
  });

  const { data: upcomingMovies } = useQuery({
    queryKey: ['movies', 'upcoming', activeCategory],
    queryFn: () => getUpcomingMovies(),
  });

  const {
    data: popularData,
    fetchNextPage: fetchNextPopular,
    hasNextPage: hasMorePopular,
    isFetchingNextPage: isLoadingPopular
  } = useInfiniteQuery<MoviePage>({
    queryKey: ['movies', 'popular'],
    queryFn: ({ pageParam = 1 }) => getPopularMovies(pageParam),
    getNextPageParam: (lastPage: MoviePage, pages) => 
      pages.length < lastPage.totalPages ? pages.length + 1 : undefined,
    initialPageParam: 1,
  });

  const handleMovieSelect = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
  };

  const allPopularMovies = popularData?.pages.flatMap(page => page.movies) || [];
  const featuredMovies = allPopularMovies.slice(0, 3);

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      <MovieBanner movies={featuredMovies} />
      <div className="relative z-10 -mt-32 space-y-16 px-4 sm:px-6 lg:px-8 pb-16">
        <CategoryTabs
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Popular Movies</h2>
            <MovieSlider
              movies={popularMovies?.movies || []}
              onMovieSelect={handleMovieSelect}
              selectedMovies={selectedMovies}
            />
          </section>
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Top Rated</h2>
            <MovieSlider
              movies={topRatedMovies?.movies || []}
              onMovieSelect={handleMovieSelect}
              selectedMovies={selectedMovies}
            />
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Upcoming Releases</h2>
            <MovieSlider
              movies={upcomingMovies?.movies || []}
              onMovieSelect={handleMovieSelect}
              selectedMovies={selectedMovies}
            />
          </section>
        </div>
        
        <div className="relative z-10 -mt-32 space-y-16 px-4 sm:px-6 lg:px-8 pb-16">
          <MovieSection
            title="All Movies"
            movies={allPopularMovies}
            onMovieSelect={handleMovieSelect}
            selectedMovies={selectedMovies}
            isLoading={isLoadingPopular}
            hasMore={hasMorePopular}
            onLoadMore={() => fetchNextPopular()}
          />
        </div>
      </div>

      {showComparison && selectedMovies.length >= 2 && (
        <MovieComparison
          movies={selectedMovies}
          onClose={() => {
            setShowComparison(false);
            setSelectedMovies([]);
          }}
        />
      )}
    </div>
  );
};