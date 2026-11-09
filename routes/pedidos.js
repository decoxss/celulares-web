const express = require('express');
const router = express.Router();
const pedidos = require('../controllers/pedidoController');
const { requiereLogin } = require('../middlewares/auth');

router.post('/', requiereLogin, pedidos.crear);
router.post('/', requiereLogin, pedidos.crear);
router.get('/:id', requiereLogin, pedidos.obtener);

module.exports = router;