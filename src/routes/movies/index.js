import { Router } from "express";
import Movies from "../../controllers/movies";
import Access from "../../middlewares/authentication";
import * as validation from "../../middlewares/validations/movie";

const router = Router();

router.post("/", Access.auth, validation.movie, Movies.createMovie);
router.post("/search", Movies.searchMovie);
router.get("/", Access.auth, Movies.getAllMovies);
router.get("/:id", Access.auth, Movies.getMovieById);
router.put("/:id", Access.auth, validation.updateMovie, Movies.updateMovieById);
router.delete("/:id", Access.auth, Movies.deleteMovieById);

export default router;
