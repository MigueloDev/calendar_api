// validate and renew json web token
const { response } = require("express");
const jwt = require("jsonwebtoken");

const validateJsonWebToken = (req, res = response, next) => {
  const token = req.header("x-token");
  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "UNAUTHORIZED",
    });
  }
  try {
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    req.uid = payload.uid;
    req.name = payload.name;
    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Token no válido",
    });
  }
};

module.exports = {
  validateJsonWebToken,
}