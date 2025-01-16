import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '../../types/movie';
import { MovieCard } from './MovieCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

interface MovieSliderProps {
  movies: Movie[];
  onMovieSelect?: (movie: Movie) => void;
  selectedMovies?: Movie[];
}

export const MovieSlider: React.FC<MovieSliderProps> = ({
  movies,
  onMovieSelect,
  selectedMovies = []
}) => {
  return (
    <div className="relative group">
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation={{
          prevEl: '.swiper-button-prev',
          nextEl: '.swiper-button-next',
        }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 }
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="py-4"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <MovieCard
              movie={movie}
              isSelected={selectedMovies.some(m => m.id === movie.id)}
              onSelect={onMovieSelect}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <button className="swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button className="swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};