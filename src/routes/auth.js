const { Router } = require("express");
const { check } = require("express-validator");
const router = Router();
const authController = require("../controllers/auth");
const { validateFields } = require("../middlewares/validateFields");
const { validateJsonWebToken } = require("../middlewares/validateJsonWebToken");

router.post(
  "/register",
  [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password es obligatorio")
      .not()
      .isEmpty()
      .isLength({ min: 6 }),
    validateFields,
  ],
  authController.createUser
);

router.post(
  "/login",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password es obligatorio")
      .not()
      .isEmpty()
      .isLength({ min: 6 }),
    validateFields
  ],
  authController.loginUser
);

router.post("/renew",[
  validateJsonWebToken
],authController.renewToken);

module.exports = router;
