import UserService from "../service/user";
import bcrypt from "../helpers/bcrypt";
import jwt from "../helpers/jwt";
import cry from "../helpers/cry";

class Authentication {
  static async login(req, res) {
    try {
      const { password, email } = req.body;
      const user = Authentication.initializeVarsForSignup(req);
      const findUser = await UserService.getUserByEmail(user.email);

      if (!findUser) {
        return res.status(403).json({
          status: 403,
          message: "Invalid email or password!",
        });
      }

      const status = bcrypt.compare(password, findUser.password);

      if (!status)
        return res.status(403).json({
          status: 403,
          message: "Invalid email or password!",
        });

      const token = jwt.jwtSign(
        { key: cry.crypto(), email: user?.email },
        process.env.SECRET,
        "1d"
      );
      return res.status(200).json({
        status: 200,
        message: "Logged in successfully!",
        token,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: 500, message: error });
    }
  }
}

export default Authentication;
