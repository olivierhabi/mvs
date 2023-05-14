import { prisma } from "../helpers/prismaClient";

class Movies {
  static async saveMovie(data) {
    try {
      return await prisma.movie.create({
        data: data,
      });
    } catch (error) {
      throw error;
    }
  }
  static async getMovieById(id) {
    try {
      return await prisma.movie.findUnique({
        where: {
          id: Number(id),
        },
      });
    } catch (error) {
      throw error;
    }
  }
  static async updateMovieById(id, data) {
    try {
      return await prisma.movie.update({
        where: {
          id: Number(id),
        },
        data: data,
      });
    } catch (error) {
      throw error;
    }
  }
  static async deleteMovieById(id, data) {
    try {
      return await prisma.movie.delete({
        where: {
          id: Number(id),
        },
      });
    } catch (error) {
      throw error;
    }
  }
  static async getAllMovies(userId) {
    try {
      return await prisma.movie.findMany({
        where: {
          userId: userId,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}

export default Movies;
