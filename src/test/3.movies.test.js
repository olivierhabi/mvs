import chai from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import Movies from "../controllers/movies";
import MovieService from "../service/movies";
import movieDB from "../providers/movies";
import app from "../app";
import httpMocks from "node-mocks-http";

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

  describe("GET /movies/:id", () => {
    it("should get a movie by ID", (done) => {
      const movie = { id: 1, movieId: 100, userId: 6 };
      const movieDetails = { title: "Test Movie", id: 100 };
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiIiLCJlbWFpbCI6IndhbHRlcm9saXZpZXI2QGdtYWlsLmNvbSIsImlhdCI6MTY4NDA0MTA5NX0.7EQQAJTKA8TqVImkkPPRhZhaQuHoyVFSc9kBapdQFKs";

      sinon.stub(MovieService, "getMovieById").returns(movie);
      sinon.stub(movieDB, "getMovieById").returns(movieDetails);

      chai
        .request(app)
        .get(`/movies/${movie.id}`)
        .set("Authorization", `Bearer ${token}`)
        .set("user", { id: 6 })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.data.should.have.property("id").eql(1);
          res.body.data.should.have.property("movie").eql(movieDetails);
          done();
        });
    });
  });

  describe("DELETE /movies/:id", () => {
    const user = { id: 6 };
    const movie = { id: 1, userId: user.id };

    it("should delete a movie and return status 200", (done) => {
      sinon.stub(MovieService, "getMovieById").returns(Promise.resolve(movie));
      sinon
        .stub(MovieService, "deleteMovieById")
        .returns(Promise.resolve(movie));

      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiIiLCJlbWFpbCI6IndhbHRlcm9saXZpZXI2QGdtYWlsLmNvbSIsImlhdCI6MTY4NDA0MTA5NX0.7EQQAJTKA8TqVImkkPPRhZhaQuHoyVFSc9kBapdQFKs";

      chai
        .request(app)
        .delete(`/movies/${movie.id}`)
        .set("Authorization", `Bearer ${token}`)
        .set("user", user) // Set mocked user
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Movie deleted");
          res.body.should.have.property("data").eql(movie);
          done();
        });
    });
  });

  describe("GET /movies", () => {
    it("should get all movies", (done) => {
      const mock = sinon.mock(MovieService);
      mock
        .expects("getAllMovies")
        .once()
        .resolves([
          { id: 1, title: "Movie 1" },
          { id: 2, title: "Movie 2" },
        ]);

      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiIiLCJlbWFpbCI6IndhbHRlcm9saXZpZXI2QGdtYWlsLmNvbSIsImlhdCI6MTY4NDA0MTA5NX0.7EQQAJTKA8TqVImkkPPRhZhaQuHoyVFSc9kBapdQFKs";

      chai
        .request(app)
        .get("/movies")
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.status.should.be.eql(200);
          res.body.data.should.be.a("array");
          res.body.data.length.should.be.eql(2);
          mock.verify();

          done();
        });
    });
  });
});
