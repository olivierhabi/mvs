import axios from "axios";
import sinon from "sinon";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import config from "../config/config";
import Movies from "../providers/movies"; // the path to your Movies.js file
import nodeFetch from "node-fetch";

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("Movies", () => {
  let axiosGetStub;
  let fetchStub;

  beforeEach(() => {
    axiosGetStub = sinon.stub(axios, "get");
    fetchStub = sinon.stub(globalThis, "fetch");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("movieSearch", () => {
    it("returns serialized data when axios get request succeeds", async () => {
      const mockResponse = {
        data: {
          results: [
            { id: 1, title: "Movie1", release_date: "2021-01-01" },
            { id: 2, title: "Movie2", release_date: "2022-02-02" },
          ],
        },
      };
      axiosGetStub.resolves(mockResponse);

      const result = await Movies.movieSearch("query");
      const expectedMovies = [
        { id: 1, title: "Movie1", release_date: "2021-01-01" },
        { id: 2, title: "Movie2", release_date: "2022-02-02" },
      ];

      expect(result).to.deep.equal(expectedMovies);
    });

    it("throws an error when axios get request fails", async () => {
      axiosGetStub.rejects(new Error("Network error"));

      await expect(Movies.movieSearch("query")).to.be.rejectedWith(
        "Network error"
      );
    });
  });

  describe("getMovieById", () => {
    it("returns movie data when axios get request succeeds", async () => {
      const mockResponse = {
        data: {
          id: 1,
          title: "Movie1",
          release_date: "2021-01-01",
        },
      };
      axiosGetStub.resolves(mockResponse);

      const result = await Movies.getMovieById(1);
      const expectedMovie = {
        id: 1,
        title: "Movie1",
        release_date: "2021-01-01",
      };

      expect(result).to.deep.equal(expectedMovie);
    });

    it("returns null when axios get request responds with status 404", async () => {
      const error = new Error("Not Found");
      error.response = { status: 404 };
      axiosGetStub.rejects(error);

      const result = await Movies.getMovieById(1);

      expect(result).to.be.null;
    });

    it("throws an error when axios get request fails with non-404 status", async () => {
      const error = new Error("Network error");
      error.response = { status: 500 };
      axiosGetStub.rejects(error);

      await expect(Movies.getMovieById(1)).to.be.rejectedWith("Network error");
    });
  });
});
