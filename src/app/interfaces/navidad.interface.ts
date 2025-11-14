export interface Asistente {
  documento: String;
  nombre: String;
  edad: String;
  mensaje: String;
  beneficios: Beneficios[];
}

export interface Beneficios {
  idBeneficio: String;
  nombre: String;
  estado: String;
}

export interface Asistentes {
  documento: String;
  nombre: String;
  invitados: Invitado[];
  tipo?: String;
}

export interface Invitado {
  documento: String;
  nombre: String;
}

export class AsistenteLdap {
  documento: string = "";
  nombre: string = "";
}

export interface resValidaUser {
  estado: number;
  salida: string;
  error: string;
  asistente?: AsistenteLdap;
}
