import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NavidadService } from "src/app/services/navidad.service";
import { UtilitiesService } from "src/app/services/utilities.service";
declare var $;

@Component({
  selector: "app-crear",
  templateUrl: "./crear.component.html",
  styleUrls: ["./crear.component.css"],
})
export class CrearComponent implements OnInit {
  formCreateUser: FormGroup;
  tipoAsistenteMenor: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private navidadService: NavidadService,
    private router: Router,
    public utilitiesService: UtilitiesService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.formCreateUser = this.formBuilder.group({
      documento: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
      nombre: ["", [Validators.required]],
      docPadre: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
      nombrePadre: ["", [Validators.required]],
      tipo: ["", [Validators.required]],
      genero: [""],
      edad: ["", [Validators.pattern("^[0-9]*$")]],
      // cargo: [""],
      // nivel1: [""],
      // nivel2: [""],
      // nivel3: [""],
    });
  }

  capturar(valorFormulario: String, valorSeleccionado: String) {
    if (valorFormulario == "tipo") {
      this.formCreateUser.get("tipo").setValue(valorSeleccionado);
      if (valorSeleccionado == "H1" || valorSeleccionado == "H2") {
        this.formCreateUser
          .get("edad")
          .setValidators([Validators.required, Validators.pattern("^[0-9]*$")]);
        this.formCreateUser.get("genero").setValidators([Validators.required]);
        this.tipoAsistenteMenor = true;
      } else {
        this.formCreateUser
          .get("edad")
          .setValidators([Validators.pattern("^[0-9]*$")]);
        this.formCreateUser.get("genero").setValidators(null);
        this.tipoAsistenteMenor = false;
      }
      this.formCreateUser.get("edad").updateValueAndValidity();
      this.formCreateUser.get("genero").updateValueAndValidity();
      this.formCreateUser.get("edad").setValue("");
      this.formCreateUser.get("genero").setValue("");
    } else {
      this.formCreateUser.get("genero").setValue(valorSeleccionado);
    }
  }

  limpiarBusqueda() {
    this.formCreateUser.reset();
  }

  createUser() {
    this.utilitiesService.loading = true;
    if (this.formCreateUser.invalid) {
      Object.values(this.f).forEach((control) => {
        control.markAllAsTouched();
      });
      this.utilitiesService.loading = false;
      return;
    } else {
      let body;
      body = this.generateNewUser();
      this.navidadService.guardarAsistente(body).subscribe((response: JSON) => {
        if (response["respuesta"] == true) {
          this.utilitiesService.messageTitleModal =
            "Usuario guardado correctamente";
          this.utilitiesService.messageModal =
            "Se ha guardado el usuario correctamente";
          setTimeout(() => {
            this.utilitiesService.loading = false;
            this.navidadService.listaAsistentes = null;
            this.formCreateUser.reset();
            $(".btn-modal-success").click();
          }, 1000);
        } else {
          this.utilitiesService.messageTitleModal = "Error guardando usuario";
          this.utilitiesService.messageModal = response["mensaje"];
          setTimeout(() => {
            this.utilitiesService.loading = false;
            $(".btn-modal-error").click();
          }, 1000);
        }
      });
    }
  }

  generateNewUser() {
    let body = {};
    if (
      this.formCreateUser.get("edad").value == "" ||
      this.formCreateUser.get("edad").value == null
    ) {
      body = {
        documento: this.formCreateUser.get("documento").value.toString(),
        nombre: this.formCreateUser.get("nombre").value,
        documentoPadre: this.formCreateUser.get("docPadre").value.toString(),
        nombrePadre: this.formCreateUser.get("nombrePadre").value,
        tipo: this.formCreateUser.get("tipo").value,
        genero: this.formCreateUser.get("genero").value,
        edad: 999,
      };
    } else {
      body = {
        documento: this.formCreateUser.get("documento").value.toString(),
        nombre: this.formCreateUser.get("nombre").value,
        documentoPadre: this.formCreateUser.get("docPadre").value.toString(),
        nombrePadre: this.formCreateUser.get("nombrePadre").value,
        tipo: this.formCreateUser.get("tipo").value,
        genero: this.formCreateUser.get("genero").value,
        edad: parseInt(this.formCreateUser.get("edad").value),
      };
    }

    return body;
  }

  get f() {
    return this.formCreateUser.controls;
  }

  get getDoc() {
    return (
      this.formCreateUser.get("documento").invalid &&
      this.formCreateUser.get("documento").touched
    );
  }

  get getName() {
    return (
      this.formCreateUser.get("nombre").invalid &&
      this.formCreateUser.get("nombre").touched
    );
  }

  get getDocPadre() {
    return (
      this.formCreateUser.get("docPadre").invalid &&
      this.formCreateUser.get("docPadre").touched
    );
  }

  get getNameFather() {
    return (
      this.formCreateUser.get("nombrePadre").invalid &&
      this.formCreateUser.get("nombrePadre").touched
    );
  }

  get getTipo() {
    return (
      this.formCreateUser.get("tipo").invalid &&
      this.formCreateUser.get("tipo").touched
    );
  }

  get getGenero() {
    return (
      this.formCreateUser.get("genero").invalid &&
      this.formCreateUser.get("genero").touched
    );
  }

  get getEdad() {
    return (
      this.formCreateUser.get("edad").invalid &&
      this.formCreateUser.get("edad").touched
    );
  }

  get getCargo() {
    return (
      this.formCreateUser.get("cargo").invalid &&
      this.formCreateUser.get("cargo").touched
    );
  }

  get getNivel1() {
    return (
      this.formCreateUser.get("nivel1").invalid &&
      this.formCreateUser.get("nivel1").touched
    );
  }

  get getNivel2() {
    return (
      this.formCreateUser.get("nivel2").invalid &&
      this.formCreateUser.get("nivel2").touched
    );
  }

  get getNivel3() {
    return (
      this.formCreateUser.get("nivel3").invalid &&
      this.formCreateUser.get("nivel3").touched
    );
  }
}
