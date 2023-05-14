import chai from "chai";
import sinon from "sinon";
import chaiHttp from "chai-http";

import app from "../app";
import bcrypt from "../helpers/bcrypt";
import UserService from "../service/user";

chai.use(chaiHttp);
chai.should();

describe("Authentication", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("POST /auth/login", () => {
    it("should login successfully", (done) => {
      const userStub = sinon.stub(UserService, "getUserByEmail").returns({
        email: "test@example.com",
        password: bcrypt.encrypt("password"),
      });

      const bcryptStub = sinon.stub(bcrypt, "compare").returns(true);

      chai
        .request(app)
        .post("/auth/login")
        .send({ email: "test@example.com", password: "password" })
        .end((err, res) => {
          userStub.calledOnce.should.be.true;
          bcryptStub.calledOnce.should.be.true;

          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("status").eql(200);
          res.body.should.have
            .property("message")
            .eql("Logged in successfully!");
          res.body.should.have.property("token");

          done();
        });
    });
  });
});
