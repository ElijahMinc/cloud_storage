const body = require("express-validator").body

module.exports = [
  body("email").isEmail(),
  body("password").isLength({ min: 3, max: 20 }),
]
