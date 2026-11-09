const express = require('express');
const router = express.Router();
const usuarios = require('../controllers/usuarioController');
const { requiereAdmin } = require('../middlewares/auth');

router.get('/', requiereAdmin, usuarios.listar);
router.put('/:id/rol', requiereAdmin, usuarios.cambiarRol);
router.delete('/:id', requiereAdmin, usuarios.eliminar);

module.exports = router;