const express = require('express')
const router = express.Router()
const ToughtController = require('../controllers/ToughtController')

//helpers (Importando o middleware)
const checkAuth = require('../helpers/auth').checkAuth

router.get('/dashboard', checkAuth, ToughtController.dashboard) //checkAuth inserindo o middleware
router.get('/add', checkAuth, ToughtController.createTought)
router.post('/add', checkAuth, ToughtController.createToughtAction)
router.get('/edit/:id', checkAuth, ToughtController.editTought)
router.post('/edit', checkAuth, ToughtController.editToughtAction)
router.post('/delete', checkAuth, ToughtController.delete)
router.get('/', ToughtController.showToughts)

module.exports = router

