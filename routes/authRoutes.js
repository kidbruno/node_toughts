const express = require('express');
const router = express.Router()
const AuthController = require('../controllers/AuthController');

router.get('/login', AuthController.login)
router.post('/login', AuthController.loginAction)
router.get('/register', AuthController.register)
router.post('/register', AuthController.registerAction)
router.get('/logout', AuthController.logout)

module.exports = router
