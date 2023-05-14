import bcrypt from "bcrypt";

export default class Util {
  constructor() {
    this.statusCode = null;
    this.type = null;
    this.message = null;
    this.data = null;
  }

  setSuccess(message, statusCode, data) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.type = "success";
  }

  setSuccessPost(message, statusCode) {
    this.statusCode = statusCode;
    this.message = message;
    this.type = "success";
  }

  setError(statusCode, message) {
    this.statusCode = statusCode;
    this.message = message;
    this.type = "Error";
  }

  encrypt(plainPassword) {
    const newPass = bcrypt.hashSync(
      plainPassword,
      bcrypt.genSaltSync(10),
      null
    );
    return newPass;
  }

  compare(plainPassword, encrypted) {
    if (
      plainPassword == null ||
      plainPassword == undefined ||
      encrypted == null ||
      encrypted == undefined
    ) {
      return "password is null";
    }
    const status = bcrypt.compareSync(plainPassword, encrypted);
    if (status) {
      return status;
    }
    return status;
  }

  send(res) {
    const result = {
      statusCode: this.statusCode,
      status: this.type,
      message: this.message,
      data: this.data,
    };
    if (this.type === "success") {
      return res.status(this.statusCode).json(result);
    }
    return res.status(this.statusCode).json({
      statusCode: this.statusCode,
      status: this.type,
      message: this.message,
    });
  }

  sendPost(res) {
    const result = {
      statusCode: this.statusCode,
      status: this.type,
      message: this.message,
    };
    if (this.type === "success") {
      return res.status(this.statusCode).json(result);
    }
    return res.status(this.statusCode).json({
      statusCode: this.statusCode,
      status: this.type,
      message: this.message,
    });
  }

  setSuccessResponse(res, message, statusCode, data) {
    this.setSuccess(message, statusCode, data);
    return this.send(res);
  }

  setErrorResponse(res, message, statusCode) {
    this.setError(statusCode, message);
    return this.send(res);
  }

  getUnique(arr, comp) {
    const unique = arr
      .map((e) => e[comp])

      // store the keys of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)

      // eliminate the dead keys & store unique objects
      .filter((e) => arr[e])
      .map((e) => arr[e]);

    return unique;
  }
}
