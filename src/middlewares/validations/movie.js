import MovieSchema from "./schemas/movie/movie";
import UpdateMovieSchema from "./schemas/movie/updateMovie";
import validator from "../../helpers/validator";

export const movie = (req, res, next) => {
  validator(MovieSchema, req.body, res, next);
};
export const updateMovie = (req, res, next) => {
  validator(UpdateMovieSchema, req.body, res, next);
};
