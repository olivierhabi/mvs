import dotenv from "dotenv";

const THE_MOVIE_DB_URL = process.env.THE_MOVIE_DB_URL || "";
const THE_MOVIE_BD_SECRETE = process.env.THE_MOVIE_BD_SECRETE || "";

const config = {
  baseUrl: THE_MOVIE_DB_URL,
  apiKey: THE_MOVIE_BD_SECRETE,
};

export default config;
