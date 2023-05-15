import sinon from "sinon";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import proxyquire from "proxyquire";

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("Movies", () => {
  let prismaStub, Movies;

  beforeEach(() => {
    prismaStub = {
      movie: {
        create: sinon.stub(),
        findUnique: sinon.stub(),
        update: sinon.stub(),
        delete: sinon.stub(),
        findMany: sinon.stub(),
      },
    };

    Movies = proxyquire("../service/movies", {
      "../helpers/prismaClient": { prisma: prismaStub },
    }).default;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("saveMovie", () => {
    it("saves a movie", async () => {
      const movie = { id: 1, title: "Movie1" };
      prismaStub.movie.create.resolves(movie);

      const result = await Movies.saveMovie(movie);

      expect(result).to.deep.equal(movie);
      sinon.assert.calledWith(prismaStub.movie.create, { data: movie });
    });
  });

  describe("getMovieById", () => {
    it("returns a movie by id", async () => {
      const movie = { id: 1, title: "Movie1" };
      prismaStub.movie.findUnique.resolves(movie);

      const result = await Movies.getMovieById(1);

      expect(result).to.deep.equal(movie);
      sinon.assert.calledWith(prismaStub.movie.findUnique, {
        where: { id: 1 },
      });
    });
  });

  describe("updateMovieById", () => {
    it("updates a movie by id", async () => {
      const movie = { id: 1, title: "Updated Movie1" };
      prismaStub.movie.update.resolves(movie);

      const result = await Movies.updateMovieById(1, movie);

      expect(result).to.deep.equal(movie);
      sinon.assert.calledWith(prismaStub.movie.update, {
        where: { id: 1 },
        data: movie,
      });
    });
  });

  describe("deleteMovieById", () => {
    it("deletes a movie by id", async () => {
      const movie = { id: 1, title: "Movie1" };
      prismaStub.movie.delete.resolves(movie);

      const result = await Movies.deleteMovieById(1);

      expect(result).to.deep.equal(movie);
      sinon.assert.calledWith(prismaStub.movie.delete, { where: { id: 1 } });
    });
  });

  describe("getAllMovies", () => {
    it("returns all movies for a user", async () => {
      const movies = [
        { id: 1, title: "Movie1", userId: 1 },
        { id: 2, title: "Movie2", userId: 1 },
      ];
      prismaStub.movie.findMany.resolves(movies);

      const result = await Movies.getAllMovies(1);

      expect(result).to.deep.equal(movies);
      sinon.assert.calledWith(prismaStub.movie.findMany, {
        where: { userId: 1 },
      });
    });
  });
});
