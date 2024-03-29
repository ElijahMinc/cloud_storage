const bcrypt = require("bcrypt")

const jwt = require("jsonwebtoken")
const User = require("../modules/User.js")
const fileService = require('../services/fileService')
const { validationResult } = require("express-validator")

class AuthContoller {
  async register(req, res) {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Failed register",
          errors: errors.array(),
        })
      }

      const { email, password } = req.body

      const user = await User.findOne({ email })

      if (user) {
        return res.status(400).json({
          message: "Such a user already exists",
        })
      }
      const hashPassword = await bcrypt.hash(password, 8)

      const newUser = new User({
        email,
        password: hashPassword,
      })

      const generateToken = jwt.sign(
        { _id: newUser._id, email: newUser.email },
        process.env.SECRET_KEY
      )

      await newUser.save()

      await fileService.createPersonFolder(newUser._id)

      return res.status(201).json({
        message: "User created",
        token: generateToken,
        user: newUser,
      })
    } catch (e) {
      console.log("EROR", e)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  }

  async login(req, res) {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Failed Login",
          errors: errors.array(),
        })
      }

      const { email, password } = req.body

      const user = await User.findOne({ email })

      if (!user) {
        return res.status(400).json({
          message: "There is no such user",
        })
      }
      const isValidPassword = await bcrypt.compare(password, user.password)

      if (!isValidPassword) {
        return res.status(400).json({
          message: "Password invalid",
        })
      }

      const generateToken = jwt.sign(
        { _id: user._id, email: user.email },
        process.env.SECRET_KEY
      )

      return res.status(201).json({
        message: "Auth is success",
        token: generateToken,
        user,
      })
    } catch (e) {
      console.log(e)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  }

  async privateUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.userId })

      return res.status(200).json(user)
    } catch (e) {
      console.log("EROR", e)
      return res.status(500).json({
        message: "Server Error",
      })
    }
  }
}

module.exports = new AuthContoller()
