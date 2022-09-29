const { Router } = require("express")


const authMiddleware = require("../middlewares/auth.middleware.js")

const validateUser = require("../middlewares/validateUser.middleware")
const authController = require('../controllers/authController')
const auth = Router()

auth.post("/login", validateUser, authController.login)

auth.post("/register", validateUser, authController.register)

auth.get("/user", authMiddleware, authController.privateUser)

module.exports = auth
