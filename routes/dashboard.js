const express = require('express');
const router = express.Router();
const dashboard = require('../controllers/dashboardController');
const { requiereAdmin } = require('../middlewares/auth');

router.get('/', requiereAdmin, dashboard.estadisticas);

module.exports = router;