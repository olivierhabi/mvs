import sinon from "sinon";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import proxyquire from "proxyquire";

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("Movies", () => {
  let prismaStub, User;

  beforeEach(() => {
    prismaStub = {
      user: {
        create: sinon.stub(),
        findUnique: sinon.stub(),
      },
    };

    User = proxyquire("../service/user", {
      "../helpers/prismaClient": { prisma: prismaStub },
    }).default;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("createUser", () => {
    it("creates a user", async () => {
      const user = { id: 1, name: "User1", email: "user1@example.com" };
      prismaStub.user.create.resolves(user);

      const result = await User.createUser(user);

      expect(result).to.deep.equal(user);
      sinon.assert.calledWith(prismaStub.user.create, { data: user });
    });
  });

  describe("getUserByEmail", () => {
    it("returns a user by email", async () => {
      const user = { id: 1, name: "User1", email: "user1@example.com" };
      prismaStub.user.findUnique.resolves(user);

      const result = await User.getUserByEmail("user1@example.com");

      expect(result).to.deep.equal(user);
      sinon.assert.calledWith(prismaStub.user.findUnique, {
        where: { email: "user1@example.com" },
      });
    });
  });
});
