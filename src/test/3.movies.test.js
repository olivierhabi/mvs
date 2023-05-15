import chai from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import Movies from "../controllers/movies";
import MovieService from "../service/movies";
import movieDB from "../providers/movies";
import app from "../app";
import httpMocks from "node-mocks-http";
import { adjustRanks } from "../helpers/adjustRanks";

chai.use(chaiHttp);
chai.should();

chai.use(chaiHttp);
chai.should();

describe("Movies Controller", () => {
  afterEach(() => {
    sinon.restore();
  });
  describe("POST /searchMovie", () => {
    it("should search movies", (done) => {
      const movieSearchStub = sinon.stub(movieDB, "movieSearch").returns([
        { title: "Movie 1", id: 1 },
        { title: "Movie 2", id: 2 },
      ]);

      chai
        .request(app)
        .post("/movies/search?query=test")
        .send({ query: "test" })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("data");
          res.body.data.length.should.be.eql(2);

          sinon.assert.calledWith(movieSearchStub, "test");
          movieSearchStub.restore();

          done();
        });
    });
  });

  describe("createMovie", () => {
    it("should create a movie and return status 201 with movie data", async () => {
      const req = httpMocks.createRequest({
        method: "POST",
        body: { movieId: "123" },
        user: { id: "1" },
      });

      const res = httpMocks.createResponse();

      const getMovieByIdStub = sinon
        .stub(movieDB, "getMovieById")
        .resolves({ title: "Test Movie" });
      const getAllMoviesStub = sinon
        .stub(MovieService, "getAllMovies")
        .resolves([]);
      const saveMovieStub = sinon
        .stub(MovieService, "saveMovie")
        .resolves({ id: 1, movieId: 123, userId: 1, rank: 1 });

      await Movies.createMovie(req, res);

      res.statusCode.should.equal(201);
      const jsonResponse = res._getData();
      jsonResponse.status.should.equal(201);
      jsonResponse.message.should.equal("Movie successfully created");
      jsonResponse.data.movie.should.deep.equal({ title: "Test Movie" });

      getMovieByIdStub.calledOnce.should.be.true;
      getAllMoviesStub.calledOnce.should.be.true;
      saveMovieStub.calledOnce.should.be.true;
    });
  });

  describe("getMovieById", () => {
    it("should get a movie by id and return status 200 with movie data", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        params: { id: "1" },
        user: { id: "1" },
      });

      const res = httpMocks.createResponse();

      const getMovieByIdStub = sinon
        .stub(MovieService, "getMovieById")
        .resolves({ userId: "1", movieId: "123" });

      const getMovieByIdDbStub = sinon
        .stub(movieDB, "getMovieById")
        .resolves({ title: "Test Movie" });

      await Movies.getMovieById(req, res);

      res.statusCode.should.equal(200);
      const jsonResponse = res._getData();
      jsonResponse.status.should.equal(200);
      jsonResponse.data.movie.should.deep.equal({ title: "Test Movie" });
      jsonResponse.data.should.have.property("userId").equal("1");
      jsonResponse.data.should.have.property("movieId").equal("123");

      getMovieByIdStub.calledOnce.should.be.true;
      getMovieByIdDbStub.calledOnce.should.be.true;
    });

    it("should return status 404 when no movie found", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        params: { id: "1" },
        user: { id: "1" },
      });

      const res = httpMocks.createResponse();

      const getMovieByIdStub = sinon
        .stub(MovieService, "getMovieById")
        .resolves(null);

      await Movies.getMovieById(req, res);

      res.statusCode.should.equal(404);
      const jsonResponse = res._getData();
      jsonResponse.status.should.equal(404);
      jsonResponse.message.should.equal("Movie can't be found");

      getMovieByIdStub.calledOnce.should.be.true;
    });
  });

  it("should return status 404 when no movie found for update", async () => {
    const req = httpMocks.createRequest({
      method: "PUT",
      params: { id: "1" },
      user: { id: "1" },
      body: { rank: 1 },
    });

    const res = httpMocks.createResponse();

    const getMovieByIdStub = sinon
      .stub(MovieService, "getMovieById")
      .resolves(null);

    await Movies.updateMovieById(req, res);

    res.statusCode.should.equal(404);
    const jsonResponse = res._getData();
    jsonResponse.status.should.equal(404);
    jsonResponse.message.should.equal("Movie can't be found");

    getMovieByIdStub.calledOnce.should.be.true;
  });

  it("should return status 404 when movieDB movie id is invalid", async () => {
    const req = httpMocks.createRequest({
      method: "PUT",
      params: { id: "1" },
      user: { id: "1" },
      body: { movieId: "1", rank: 1 },
    });

    const res = httpMocks.createResponse();

    const getMovieByIdStub = sinon.stub(MovieService, "getMovieById").resolves({
      userId: "1",
    });

    const getMovieDbByIdStub = sinon
      .stub(movieDB, "getMovieById")
      .resolves(null);

    await Movies.updateMovieById(req, res);

    res.statusCode.should.equal(404);
    const jsonResponse = res._getData();
    jsonResponse.status.should.equal(404);
    jsonResponse.message.should.equal(
      "Please use a valid movieId from THE MOVIE BD"
    );

    getMovieByIdStub.calledOnce.should.be.true;
    getMovieDbByIdStub.calledOnce.should.be.true;

    getMovieByIdStub.restore();
    getMovieDbByIdStub.restore();
  });

  it("should return status 200 when movie is successfully updated", async () => {
    const req = httpMocks.createRequest({
      method: "PUT",
      params: { id: 22 },
      user: { id: "1" },
      body: { movieId: "1", rank: 1 },
    });

    const res = httpMocks.createResponse();

    const getMovieByIdStub = sinon
      .stub(MovieService, "getMovieById")
      .resolves({ userId: "1", rank: 1 });

    const getMovieDbByIdStub = sinon
      .stub(movieDB, "getMovieById")
      .resolves({ id: "1", title: "Test Movie" });

    const updateMovieByIdStub = sinon
      .stub(MovieService, "updateMovieById")
      .resolves({ id: 22, movieId: 19995, userId: 6, rank: 1 });

    const getAllMoviesStub = sinon.stub(MovieService, "getAllMovies").resolves([
      { id: 22, movieId: 19995, userId: 6, rank: 1 },
      { id: 7, movieId: 23421, userId: 6, rank: 2 },
    ]);

    await Movies.updateMovieById(req, res);

    res.statusCode.should.equal(200);
    const jsonResponse = res._getData();
    jsonResponse.status.should.equal(200);
    jsonResponse.data.should.deep.equal({
      id: 22,
      userId: 6,
      movieId: 19995,
      rank: 1,
      movie: { id: "1", title: "Test Movie" },
    });

    getMovieByIdStub.calledOnce.should.be.true;
    getMovieDbByIdStub.calledOnce.should.be.true;
    getAllMoviesStub.calledOnce.should.be.true;

    getMovieByIdStub.restore();
    getMovieDbByIdStub.restore();
    updateMovieByIdStub.restore();
    getAllMoviesStub.restore();
  });

  it("should return status 404 when no movie found", async () => {
    const req = httpMocks.createRequest({
      method: "DELETE",
      params: { id: "1" },
      user: { id: "1" },
    });

    const res = httpMocks.createResponse();

    const getMovieByIdStub = sinon
      .stub(MovieService, "getMovieById")
      .resolves(null);

    const deleteMovieByIdStub = sinon.stub(MovieService, "deleteMovieById");

    await Movies.deleteMovieById(req, res);

    res.statusCode.should.equal(404);
    const jsonResponse = res._getData();
    jsonResponse.status.should.equal(404);
    jsonResponse.message.should.equal("Movie can't be found");

    getMovieByIdStub.calledOnce.should.be.true;
    deleteMovieByIdStub.called.should.be.false;
  });

  it("should return status 404 when movie userId and req user id don't match", async () => {
    const req = httpMocks.createRequest({
      method: "DELETE",
      params: { id: "1" },
      user: { id: "1" },
    });

    const res = httpMocks.createResponse();

    const getMovieByIdStub = sinon
      .stub(MovieService, "getMovieById")
      .resolves({ userId: "2" });

    const deleteMovieByIdStub = sinon.stub(MovieService, "deleteMovieById");

    await Movies.deleteMovieById(req, res);

    res.statusCode.should.equal(404);
    const jsonResponse = res._getData();
    jsonResponse.status.should.equal(404);
    jsonResponse.message.should.equal("Movie can't be found");

    getMovieByIdStub.calledOnce.should.be.true;
    deleteMovieByIdStub.called.should.be.false;
  });

  it("should return status 200 when movie is deleted", async () => {
    const req = httpMocks.createRequest({
      method: "DELETE",
      params: { id: "1" },
      user: { id: "1" },
    });

    const res = httpMocks.createResponse();

    const getMovieByIdStub = sinon
      .stub(MovieService, "getMovieById")
      .resolves({ userId: "1" });

    const deleteMovieByIdStub = sinon
      .stub(MovieService, "deleteMovieById")
      .resolves({ id: "1" });

    await Movies.deleteMovieById(req, res);

    res.statusCode.should.equal(200);
    const jsonResponse = res._getData();
    jsonResponse.status.should.equal(200);
    jsonResponse.message.should.equal("Movie deleted");

    getMovieByIdStub.calledOnce.should.be.true;
    deleteMovieByIdStub.calledOnce.should.be.true;
  });

  it("should return status 200 when movies are found", async () => {
    const req = httpMocks.createRequest({
      method: "GET",
      user: { id: "1" },
    });

    const res = httpMocks.createResponse();

    const getAllMoviesStub = sinon.stub(MovieService, "getAllMovies").resolves([
      { id: "1", title: "Movie 1" },
      { id: "2", title: "Movie 2" },
    ]);

    await Movies.getAllMovies(req, res);

    res.statusCode.should.equal(200);
    const jsonResponse = res._getData();
    jsonResponse.status.should.equal(200);
    jsonResponse.data.length.should.equal(2);
    jsonResponse.data[0].title.should.equal("Movie 1");
    jsonResponse.data[1].title.should.equal("Movie 2");

    getAllMoviesStub.calledOnce.should.be.true;
  });

  it("should return status 500 when an error occurs", async () => {
    const req = httpMocks.createRequest({
      method: "GET",
      user: { id: "1" },
    });

    const res = httpMocks.createResponse();

    const getAllMoviesStub = sinon
      .stub(MovieService, "getAllMovies")
      .rejects(new Error("Something went wrong"));

    await Movies.getAllMovies(req, res);

    res.statusCode.should.equal(500);
    getAllMoviesStub.calledOnce.should.be.true;
  });
});
