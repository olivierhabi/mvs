import MovieService from "../service/movies";
import movieDB from "../providers/movies";
import { adjustRanks } from "../helpers/adjustRanks";

class Movies {
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
