import axios from "axios";
import config from "../config/config";
import fetch from "node-fetch";
globalThis.fetch = fetch;

class Movies {
  static async movieSearch(query) {
    try {
      const res = await axios.get(
        `${config.baseUrl}/3/search/movie?query=${query}`,
        {
          headers: { Authorization: `Bearer ${config.apiKey}` },
        }
      );
      return Movies.responseSerializer(res.data);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getMovieById(id) {
    try {
      const res = await axios.get(`${config.baseUrl}/3/movie/${id}`, {
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
        },
      });

      const response = res.data;

      return {
        id: response?.id,
        title: response?.title,
        release_date: response?.release_date,
      };
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw new Error(error.message);
    }
  }

  static responseSerializer(response) {
    let movies = [];
    for (const item of response.results) {
      movies.push({
        id: item.id,
        title: item.title,
        release_date: item.release_date,
      });
    }

    return movies;
  }
}

export default Movies;
