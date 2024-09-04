import Cuenta from '../models/Banco.js';
import bcryptjs from 'bcryptjs';

export const getCuenta = async (req, res) => {
    try {
        const { numeroCuenta } = req.params;
        const cuenta = await Cuenta.findOne({ numeroCuenta });
        if (!cuenta) {
            return res.status(404).json({ error: 'Cuenta no encontrada' });
        }
        res.json(cuenta);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la cuenta' });
    }
};

export const createCuenta = async (req, res) => {
    try {
        const { documentoCliente, claveAcceso } = req.body;

        const numeroCuenta = await Cuenta.getNextNumeroCuenta(); 
        const salt = await bcryptjs.genSalt(10);
        const hashedClaveAcceso = await bcryptjs.hash(claveAcceso, salt);

        const cuenta = new Cuenta({ numeroCuenta, documentoCliente, claveAcceso: hashedClaveAcceso });
        await cuenta.save();

        res.status(201).json(cuenta);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la cuenta' });
    }
};

export const consignarDinero = async (req, res) => {
  try {
      const { numeroCuenta, monto } = req.body;
       if (monto <= 0) {
          return res.status(400).json({ error: 'Monto inválido' });
      }

      const cuenta = await Cuenta.findOne({ numeroCuenta });
      if (!cuenta) {
          return res.status(404).json({ error: 'Cuenta no encontrada' });
      }

      cuenta.saldo += monto;

      await cuenta.save();

      res.json(cuenta);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al consignar el dinero' });
  }
};

export const retirarDinero = async (req, res) => {
  try {
      const { numeroCuenta, monto } = req.body;

      if (monto > (await Cuenta.findOne({ numeroCuenta })).saldo) {
          return res.status(400).json({ error: 'Monto inválido' });
      }
      


      const cuenta = await Cuenta.findOne({ numeroCuenta });
      if (!cuenta) {
          return res.status(404).json({ error: 'Cuenta no encontrada' });
      }

      cuenta.saldo -= monto;

      await cuenta.save();

      res.json(cuenta);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al retirar el dinero' });
  }
};

export const eliminarCuenta = async (req, res) => {
  try {
      const { numeroCuenta } = req.params;

      const cuentaConSaldo = await Cuenta.findOne({ numeroCuenta, saldo: 0 });
      if (!cuentaConSaldo) {
          return res.status(400).json({ error: 'Cuenta con saldo' });
      }

      const cuenta = await Cuenta.findOne({ numeroCuenta });
      if (!cuenta) {
          return res.status(404).json({ error: 'Cuenta no encontrada' });
      }

      await Cuenta.deleteOne({ numeroCuenta });

      res.json({ message: 'Cuenta eliminada exitosamente' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar la cuenta' });
  }
};
