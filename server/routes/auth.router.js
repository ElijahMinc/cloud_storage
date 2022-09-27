const { Router } = require("express")


const authMiddleware = require("../middlewares/auth.middleware.js")

const validateUser = require("../middlewares/validateUser.middleware")
const auth = Router()

auth.post("/login", validateUser, )

auth.post("/register", validateUser, )

auth.get("/user", authMiddleware, )

module.exports = auth
