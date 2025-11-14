import { Component, OnInit, ViewChild } from "@angular/core";

import { Router } from "@angular/router";
import { AuthenticationService } from "../../../services/authentication.service";
import { UtilitiesService } from "../../../services/utilities.service";
import { environment } from "src/environments/environment";
import {
  ListaPersonasPorDesayunarCV,
  respuestaMetodo3,
} from "src/app/interfaces/alojamiento.interface";
declare var $;
import { first } from "rxjs/operators";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  public environment = environment;
  @ViewChild("buscarTexto") inputName;
  listado: ListaPersonasPorDesayunarCV[] = [];

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    public utilitiesService: UtilitiesService
  ) {}

  ngOnInit() {}

  buscador(termino: string) {
    /* this.alojamientoService
      .consultarInformacionUsuario()
      .pipe(first())
      .subscribe((response: respuestaMetodo3) => {

        console.log("respuestaWS:", this.listado);

        for (
          let index = 0;
          index < response.listadoPersonasPorDesayunar.length;
          index++
        ) {
          const element = response.listadoPersonasPorDesayunar[index];

          if (element.desayuno == false) {
            this.listado.push(element);
          }
        }
        console.log("Listado sin desayunar", this.listado);
      });
    this.utilitiesService.sendMessage(this.listado.toString); */
    if (termino != "") {
      this.router.navigate(["/buscar", termino]);
    } else {
      this.router.navigate(["/home"]);
    }
  }

  limpiarBusqueda() {
    this.inputName.nativeElement.value = " ";
    this.router.navigate(["/home"]);
  }

  enviarMensaje(mensaje: String) {
    this.utilitiesService.sendMessage(mensaje);
  }
}
