import express from 'express';
import { getCuenta, createCuenta, consignarDinero, retirarDinero, eliminarCuenta } from '../controllers/bancoController.js';

const router = express.Router();

router.get('/cuentas/:numeroCuenta', getCuenta);
router.post('/cuentas', createCuenta);
router.post('/cuentas/consignar', consignarDinero);
router.post('/cuentas/retirar', retirarDinero);
router.delete('/cuentas/:numeroCuenta', eliminarCuenta);

export default router;
