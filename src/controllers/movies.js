import MovieService from "../service/movies";
import movieDB from "../providers/movies";
import { adjustRanks } from "../helpers/adjustRanks";

class Movies {
  static async searchMovie(req, res) {
    let query = req.query.query ? String(req.query.query) : "";
    if (!query || query === "") {
      return res.status(400).send({
        status: 400,
        error: "Query is required",
      });
    }
    try {
      const movies = await movieDB.movieSearch(query);
      return res.status(200).send({
        status: 200,
        data: movies,
      });
    } catch (error) {
      return res.status(500).json({ status: 500, message: error });
    }
  }
  static async createMovie(req, res) {
    try {
      const movie = await movieDB.getMovieById(parseInt(req.body.movieId));

      if (!movie) {
        return res.status(404).send({
          status: 404,
          message: "Please use a valid movieId from THE MOVIE BD",
        });
      }
      const userMovies = await MovieService.getAllMovies(req.user.id);

      let maxRank = 0;
      for (let movie of userMovies) {
        if (movie.rank > maxRank) {
          maxRank = movie.rank;
        }
      }

      const rank = maxRank + 1;

      const createMovie = await MovieService.saveMovie({
        movieId: req.body.movieId,
        userId: req.user.id,
        rank,
      });

      return res.status(201).send({
        status: 201,
        message: "Movie successfully created",
        data: { ...createMovie, movie },
      });
    } catch (error) {
      return res.status(500).json({ status: 500, message: error });
    }
  }
  static async getMovieById(req, res) {
    try {
      const { id } = req.params;
      const getMovieById = await MovieService.getMovieById(id);

      if (!getMovieById) {
        return res.status(404).send({
          status: 404,
          message: "Movie can't be found",
        });
      }
      if (getMovieById.userId !== req.user.id) {
        return res.status(404).send({
          status: 404,
          message: "Movie can't be found",
        });
      }

      const movie = await movieDB.getMovieById(parseInt(getMovieById.movieId));

      return res.status(200).send({
        status: 200,
        data: { ...getMovieById, movie },
      });
    } catch (error) {
      return res.status(500).json({ status: 500, message: error });
    }
  }
  static async updateMovieById(req, res) {
    try {
      const { id } = req.params;
      let { rank } = req.body;

      const getMovieById = await MovieService.getMovieById(id);

      if (!getMovieById) {
        return res.status(404).send({
          status: 404,
          message: "Movie can't be found",
        });
      }

      if (getMovieById.userId !== req.user.id) {
        return res.status(404).send({
          status: 404,
          message: "Movie can't be found",
        });
      }

      const movie = await movieDB.getMovieById(parseInt(req.body.movieId));

      if (req.body.movieId) {
        if (!movie) {
          return res.status(404).send({
            status: 404,
            message: "Please use a valid movieId from THE MOVIE BD",
          });
        }
      }

      const updateMovieById = await MovieService.updateMovieById(id, {
        movieId: req.body.movieId,
      });

      if (rank) {
        rank = parseInt(rank);
        // Get all movies of the current user
        let userMovies = await MovieService.getAllMovies(req.user.id);

        // Sort movies by rank
        await userMovies.sort((a, b) => a.rank - b.rank);

        // Adjust ranks
        const updatedMovies = await adjustRanks(userMovies, id, rank);

        // Update each movie in the database with its new rank
        for (let movie of updatedMovies) {
          await MovieService.updateMovieById(movie.id, { rank: movie.rank });
        }
      }

      updateMovieById.rank = rank;

      return res.status(200).send({
        status: 200,
        data: { ...updateMovieById, movie },
      });
    } catch (error) {
      return res.status(500).json({ status: 500, message: error });
    }
  }
  static async deleteMovieById(req, res) {
    try {
      const { id } = req.params;

      const getMovieById = await MovieService.getMovieById(id);

      if (!getMovieById) {
        return res.status(404).send({
          status: 404,
          message: "Movie can't be found",
        });
      }

      if (getMovieById.userId !== req.user.id) {
        return res.status(404).send({
          status: 404,
          message: "Movie can't be found",
        });
      }

      const deleteMovieById = await MovieService.deleteMovieById(id);

      return res.status(200).send({
        status: 200,
        message: "Movie deleted",
        data: deleteMovieById,
      });
    } catch (error) {
      return res.status(500).json({ status: 500, message: error });
    }
  }
  static async getAllMovies(req, res) {
    try {
      const getAllMovies = await MovieService.getAllMovies(req.user.id);

      return res.status(200).send({
        status: 200,
        data: getAllMovies,
      });
    } catch (error) {
      return res.status(500).json({ status: 500, message: error });
    }
  }
}

export default Movies;
