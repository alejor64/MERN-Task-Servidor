//Routes to auth user
const express = require('express')
const router = express.Router()
const {check} = require('express-validator')
const auth = require('../middleware/auth')
const authController = require('../controlers/authController')

//Login
// api/auth
router.post('/',
    authController.authUser
)

//Get authenticated user
router.get('/',
    auth,
    authController.userAuthenticated
)

module.exports = router