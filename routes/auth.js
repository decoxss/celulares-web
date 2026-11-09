const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');

router.post('/registro', auth.registro);
router.post('/login', auth.login);
router.post('/logout', auth.logout);
router.get('/sesion', auth.sesion);

module.exports = router;