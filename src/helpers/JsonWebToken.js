const jwt = require('jsonwebtoken');

const generateJWT = (uid = '', userName = '') => {
  return new Promise((resolve, reject) => {
    const payload = { uid, name: userName };
    jwt.sign(payload, process.env.SECRET_JWT_SEED, {
      expiresIn: '30min',
    }, (err, token) => {
      if (err) {
        console.log(err);
        reject('Error al generar el token');
      } else {
        resolve(token);
      }
    });
  });
};

module.exports = {
  generateJWT
}