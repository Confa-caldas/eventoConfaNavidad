import { Injectable } from "@angular/core";
import {
  listadoSeleccion,
  ListaPersonasPorDesayunarCV,
  respuestaMetodo3,
} from "../interfaces/alojamiento.interface";
import { AlojamientoService } from "./alojamiento.service";
import { first } from "rxjs/operators";
declare var $;
@Injectable({
  providedIn: "root",
})
export class ConsultarPersonasService {
  listado: ListaPersonasPorDesayunarCV[] = [];
  listaMostrarVista: ListaPersonasPorDesayunarCV[] = [];
  lenghtListado: number;
  constructor(private alojamientoService: AlojamientoService) {}

  listarPersonas(terminoBusqueda: string) {
    this.alojamientoService
      .consultarInformacionUsuario()
      .pipe(first())
      .subscribe((response: respuestaMetodo3) => {
        this.listado = response.listadoPersonasPorDesayunar;
        /*  console.log("respuestaWS:", this.listado); */

        if (terminoBusqueda) {
          /*   console.log("Entre aqui"); */
          if (!isNaN(parseInt(terminoBusqueda))) {
            /*    console.log("es numero"); */
            this.consultarPersonaDesayunoPorDocumento(terminoBusqueda);
          } else {
            /*  console.log("es letras"); */
            this.consultarPersonaDesayunoPorNombre(terminoBusqueda);
          }
          /*   console.log("respuestaWS:", this.listado); */

          this.lenghtListado = this.listaMostrarVista.length;
        } else {
          this.listaMostrarVista = this.listado;
        }
      });

    /*    console.log(this.listaMostrarVista); */
  }

  consultarPersonaDesayunoPorDocumento(parametro: string) {
    for (let index = 0; index < this.listado.length; index++) {
      const element = this.listado[index];

      if (element.cedula_asistente == parametro) {
        this.listaMostrarVista.push(element);
        /*    console.log(element); */
      }
    }
  }
  consultarPersonaDesayunoPorNombre(parametro: string) {
    for (let index = 0; index < this.listado.length; index++) {
      const element = this.listado[index];
      if (element.nombre_asistente == parametro) {
        this.listaMostrarVista.push(element);
      }
    }
  }
}
