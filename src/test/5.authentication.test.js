import sinon from "sinon";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import jwt from "../helpers/jwt";
import UserService from "../service/user";
import Access from "../middlewares/authentication";

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("Access", () => {
  let jwtVerifyStub;
  let getUserByEmailStub;

  beforeEach(() => {
    jwtVerifyStub = sinon.stub(jwt, "jwtVerify");
    getUserByEmailStub = sinon.stub(UserService, "getUserByEmail");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("auth", () => {
    it("returns 401 status when no authorization header is present", async () => {
      const req = {
        headers: {},
      };
      const res = {
        status: function (statusCode) {
          this.statusCode = statusCode;
          return this;
        },
        json: function (data) {
          this.data = data;
          return this;
        },
      };
      const next = sinon.spy();

      await Access.auth(req, res, next);

      expect(res.statusCode).to.equal(401);
      expect(res.data).to.deep.equal({
        status: 401,
        message: "Invalid access token",
      });
      expect(next.notCalled).to.be.true;
    });
    it("calls next when user found with decoded email", async () => {
      const req = {
        headers: {
          authorization: "Bearer token",
        },
      };
      const res = {
        status: function (statusCode) {
          this.statusCode = statusCode;
          return this;
        },
        json: function (data) {
          this.data = data;
          return this;
        },
      };
      const next = sinon.spy();
      const mockDecoded = { email: "user@domain.com" };
      const mockUser = { email: "user@domain.com", id: 1 };

      jwtVerifyStub.returns(mockDecoded);
      getUserByEmailStub.resolves(mockUser);

      await Access.auth(req, res, next);

      expect(req.user).to.deep.equal(mockUser);
      expect(next.calledOnce).to.be.true;
    });

    it("returns 500 status when an error occurs", async () => {
      const req = {
        headers: {
          authorization: "Bearer token",
        },
      };

      const res = {
        status: function (statusCode) {
          this.statusCode = statusCode;
          return this;
        },
        json: function (data) {
          this.data = data;
          return this;
        },
      };

      const next = sinon.spy();
      const error = new Error("An error occurred");

      jwtVerifyStub.throws(error);

      await Access.auth(req, res, next);

      expect(res.statusCode).to.equal(500);
      expect(res.data).to.deep.equal({ status: 500, message: error });
      expect(next.notCalled).to.be.true;
    });
  });
});
