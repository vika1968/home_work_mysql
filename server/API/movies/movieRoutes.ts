import express from "express";
import {
  getAllMovies,
  getMovieById,
  searchMovies 
} from "./movieCtrl";

const movieRouter = express.Router();

movieRouter.get("/", getAllMovies);
movieRouter.get("/:id", getMovieById);
movieRouter.post("/search-movies", searchMovies);

export default movieRouter;
