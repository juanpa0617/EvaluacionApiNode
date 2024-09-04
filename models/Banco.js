import mongoose from 'mongoose';

const cuentaSchema = new mongoose.Schema({
  numeroCuenta: { type: Number, unique: true, required: true },
  documentoCliente: { type: String, required: true },
  fechaApertura: { type: Date, default: Date.now },
  saldo: { type: Number, default: 0 },
  claveAcceso: { type: String, required: true, minlength : 4 },
});

cuentaSchema.statics.getNextNumeroCuenta = async function () {
  const lastCuenta = await this.findOne().sort({ numeroCuenta: -1 });
  return lastCuenta ? lastCuenta.numeroCuenta + 1 : 1;
};

export default mongoose.model('Cuenta', cuentaSchema);
