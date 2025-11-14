export interface respuestaMetodo3 {
  esado: string;
  listadoPersonasPorDesayunar: Array<ListaPersonasPorDesayunarCV>;
  mensaje: string;
}

export interface ListaPersonasPorDesayunarCV {
  sede_idCV: String;
  nombreSedeCV: String;
  ingresoCV: String;
  fechaIngreso: String;
  horaIngreso: String;
  alojamientoId: String;
  recurso_fisico_id: String;
  recurso_fisico: String;
  fechaIngreso_reserva: String;
  fechaSalida_reserva: String;
  pago: String;
  cedula_titular: String;
  titular_reserva: String;
  cedula_asistente: String;
  nombre_asistente: String;
  desayuno: Boolean;
}

export interface listadoSeleccion {
  alojamiento_id: number;
  sede_id: number;
  nombre_asistente: string;
  documento_asistente: string;
  idCheck: number;
}
export interface respuestaMetodo4 {
  estado: string;
  mensaje: string;
}
