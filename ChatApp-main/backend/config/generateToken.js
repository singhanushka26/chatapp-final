const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, "ajfahsdfkjah;dkfjahd;fk", {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
