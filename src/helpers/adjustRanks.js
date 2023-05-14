export const adjustRanks = (movies, movieId, newRank) => {
  // First, find the movie that is being updated
  const movie = movies.find((movie) => movie.id === parseInt(movieId));

  // Then, remove the movie from its current position in the array
  movies = movies.filter((movie) => movie.id !== parseInt(movieId));

  // Insert the movie at its new position (subtract 1 because arrays are zero-indexed)
  movies.splice(newRank - 1, 0, movie);

  // Finally, update the ranks of all movies
  for (let i = 0; i < movies.length; i++) {
    movies[i].rank = i + 1;
  }

  return movies;
};
