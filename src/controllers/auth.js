const {response} = require('express');
const  { validationResult } = require('express-validator');
const { generateJWT } = require('../helpers/JsonWebToken');
const bcrypt = require('bcryptjs');
const Users = require('../models/User');

const createUser = async (req, res = response) => {
  try {

    const { email, password } = req.body;
    const emailExists = await Users.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        ok: false,
        msg: 'El email ya existe'
      });
    }
    const salt = bcrypt.genSaltSync();
    const encrypedPassword = await bcrypt.hash(password, salt);
    const user = Users({...req.body, password: `${encrypedPassword}`});
    const newUser = await user.save();
    const token = await generateJWT(newUser._id, newUser.name);
    res.send({
      ok: true,
      uid: newUser._id,
      name: newUser.name,
      token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al crear usuario'
    });
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: 'Credenciales incorrectas'
      });
    }
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Credenciales incorrectas'
      });
    }
    const token = await generateJWT(user._id, user.name);
    res.send({
      ok: true,
      uid: user._id,
      token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error fatal hable con el Miguelo'
    });
  }
}

const renewToken = async (req, res) => {
  const { uid, name } = req;
  const token = await generateJWT(uid, name);
  res.send({
    ok: true,
    token
  });
}

module.exports = {
  createUser,
  loginUser,
  renewToken
}