const express = require('express');
const router = express.Router();
const CelularController = require('../controllers/CelularController');

router.get('/', CelularController.listar);

module.exports = router;
