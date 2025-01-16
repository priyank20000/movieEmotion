import { GoogleGenerativeAI } from '@google/generative-ai';
import { Movie } from '../types/movie';

const genAI = new GoogleGenerativeAI('AIzaSyCiUqOCGtUpckCgQxW8rZCiLdOfDwR19AM');

export const compareMovies = async (movies: Movie[]): Promise<string> => {
  try {
    if (!movies || movies.length === 0) {
      throw new Error('No movies provided.');
    }
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const movieDetails = movies.map((movie) => ({
      title: movie.title,
      year: new Date(movie.release_date).getFullYear(),
      rating: movie.vote_average,
      overview: movie.overview || 'No overview available',
    }));

    const prompt = `Analyze and compare these ${movies.length} movies in detail:
      ${movieDetails.map((movie, i) => `
        Movie ${i + 1}: ${movie.title} (${movie.year})
        Rating: ${movie.rating}/10
        Overview: ${movie.overview}
      `).join('\n')}

      Provide a structured analysis following this EXACT format for EACH section.
      Each section MUST have analysis for ALL ${movies.length} movies, clearly labeled.

      1. Storytelling & Plot Analysis
      ${movies.map((movie, i) => `
      Movie ${i + 1}: [Write 3-4 sentences analyzing ${movie.title}'s plot structure, character development, and storytelling]
      `).join('\n')}

      2. Technical Elements
      ${movies.map((movie, i) => `
      Movie ${i + 1}: [Write 3-4 sentences about ${movie.title}'s direction, cinematography, and technical aspects]
      `).join('\n')}

      3. Themes & Impact
      ${movies.map((movie, i) => `
      Movie ${i + 1}: [Write 3-4 sentences about ${movie.title}'s themes, messages, and cultural impact]
      `).join('\n')}

      4. Audience & Reception
      ${movies.map((movie, i) => `
      Movie ${i + 1}: [Write 3-4 sentences about ${movie.title}'s target audience and critical reception]
      `).join('\n')}

      5. Strengths & Weaknesses
      ${movies.map((movie, i) => `
      Movie ${i + 1}: [List 2-3 major strengths and 2-3 weaknesses of ${movie.title}]
      `).join('\n')}

      6. Final Recommendations
      ${movies.map((movie, i) => `
      Movie ${i + 1}: [Write 2-3 sentences with specific recommendations for watching ${movie.title}]
      `).join('\n')}

      7. AI Suggestion
      [Write a movie name in one sentence about which movie is better based on the analysis "" duble comme mein dena name]

      8. movie type
      [Write a movie type like horror, action, comedy, etc.]
      IMPORTANT RULES:
      1. ALWAYS include analysis for ALL ${movies.length} movies in EVERY section
      2. ALWAYS start each movie's analysis with "Movie 1:", "Movie 2:", etc.
      3. Keep the analysis balanced - write similar length for all movies
      4. Be specific and detailed for all movies
      5. Use the movie titles in the analysis
      6. Follow the exact format and structure provided`;
      

    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log(response.text());
    return response.text();
  } catch (error) {
    console.error('Error generating movie comparison:', error);
    return 'Unable to generate comparison at this time.';
  }
};