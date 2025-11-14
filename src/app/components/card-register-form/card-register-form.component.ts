import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { first } from 'rxjs/operators';
import { User } from '../../interfaces/user.interface';
import { Md5 } from 'ts-md5';
import { UtilitiesService } from '../../services/utilities.service';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { ValidatorsService } from '../../services/validators.service';

declare var $;

@Component({
  selector: 'app-card-register-form',
  templateUrl: './card-register-form.component.html',
  styleUrls: ['./card-register-form.component.css']
})
export class CardRegisterFormComponent implements OnInit {

  formRegister: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private validatorsService: ValidatorsService,
    private authenticationService: AuthenticationService,
    public utilitiesService: UtilitiesService,
    private cookieService: CookieService
  ) {
    this.createForm();
  }

  ngOnInit(
  ) {

  }

  createForm() {
    this.formRegister = this.formBuilder.group({
      firstName: ['',
        [
          Validators.required,
          Validators.pattern("[A-Za-zá-úÁ-Ú ]*"),
        ]],
      secondName: ['', Validators.pattern("[A-Za-zá-úÁ-Ú ]*")],
      firstLastName: ['', [
        Validators.required,
        Validators.pattern("[A-Za-zá-úÁ-Ú ]*")
      ]],
      secondLastName: ['', Validators.pattern("[A-Za-zá-úÁ-Ú ]*")],
      document: [{ value: '', disabled: true }, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(15),
        Validators.pattern("^[0-9]+")
      ]],
      email: ['', [
        Validators.required,
        Validators.pattern("^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@" + "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$"),
        Validators.email
      ]],
      confirmEmail: ['', [
        Validators.required,
        Validators.pattern("^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@" + "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$"),
        Validators.email,
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      confirmPassword: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      aceptHabeasData: [false, [
        Validators.required,
        this.validatorsService.aceptHabeasData
      ]]
    }, {
      validators: [
        this.validatorsService.passwordsEquals('password', 'confirmPassword'),
        this.validatorsService.emailsEquals('email', 'confirmEmail')
      ]
    });
  }

  get f() {
    return this.formRegister.controls;
  }

  get getFirstName() {
    return this.formRegister.get('firstName').invalid && this.formRegister.get('firstName').touched;
  }

  get getSecondName() {
    return this.formRegister.get('secondName').touched && this.formRegister.get('secondName').errors;
  }

  get getFirstLastName() {
    return this.formRegister.get('firstLastName').invalid && this.formRegister.get('firstLastName').touched;
  }

  get getSecondLastName() {
    return this.formRegister.get('secondLastName').touched && this.formRegister.get('secondLastName').errors;
  }

  get getDocument() {
    return this.formRegister.get('document').invalid && this.formRegister.get('document').touched;
  }

  get getEmail() {
    return this.formRegister.get('email').invalid && this.formRegister.get('email').touched;
  }

  get getConfirmEmail() {
    const email1 = this.formRegister.get('email').value;
    const email2 = this.formRegister.get('confirmEmail').value;
    return (email1 === email2) ? false : true;
  }

  get getPassword() {
    return this.formRegister.get('password').invalid && this.formRegister.get('password').touched;
  }

  get getConfirmPassword() {
    const password1 = this.formRegister.get('password').value;
    const password2 = this.formRegister.get('confirmPassword').value;
    return (password1 === password2) ? false : true;
  }

  get getAceptHabeasData() {
    return this.formRegister.get('aceptHabeasData').touched && !this.formRegister.get('aceptHabeasData').value;
  }

  fullNameDisabled() {
    let existUser = this.utilitiesService.existUser;
    let registerUser = this.utilitiesService.registerUser;
    // console.log("existUser", existUser);
    this.formRegister.get('document').setValue(registerUser.documento);
    if (existUser) {
      this.formRegister.get('firstName').setValue(registerUser.primerNombre);
      this.formRegister.get('secondName').setValue(registerUser.segundoNombre);
      this.formRegister.get('firstLastName').setValue(registerUser.primerApellido);
      this.formRegister.get('secondLastName').setValue(registerUser.segundoApellido);
    }
  }

  cleanForm() {
    this.cookieService.delete('gtoken');
    this.formRegister.reset({
      firstName: '',
      secondName: '',
      firstLastName: '',
      secondLastName: '',
      email: '',
      confirmEmail: '',
      password: '',
      confirmPassword: '',
      aceptHabeasData: false
    });
  }

  onSubmit() {
    this.fullNameDisabled();
    // console.log("document", this.f.document.value.toString());

    if (this.formRegister.invalid) {
      Object.values(this.f)
        .forEach(control => {
          control.markAllAsTouched();
        });
      return;
    }
    else {
      let userRegister = this.generateUser(this.f, this.utilitiesService.registerUser);

      if (this.formRegister.controls['document'].value !== '' && this.formRegister.controls['aceptHabeasData'].value) {

        this.utilitiesService.loading = true;
        // console.log(userRegister);

        this.authenticationService.saveUser(userRegister)
          .pipe(first())
          .subscribe((response: any) => {
            if (response === '') {
              this.utilitiesService.messageTitleModal = 'Registro exitoso';
              this.utilitiesService.messageModal = 'Te hemos enviado un correo de confirmación. Debes confirmar para poder ingresar, si no ves el correo en tu bandeja principal por favor revisa tu carpeta de SPAM, Gracias!.';
              this.utilitiesService.backLogin = false;

              $('.btn-close-form-register').click();
              setTimeout(() => {
                this.utilitiesService.loading = false;
                $('.btn-modal-success').click();
              }, 1000);

              this.cleanForm();
            }
            else {
              this.utilitiesService.messageTitleModal = 'Tu registro ha fallado';
              this.utilitiesService.messageModal = response;
              this.utilitiesService.backLogin = false;

              // console.log("Registro invalido:", response);
              setTimeout(() => {
                this.utilitiesService.loading = false;
                $('.btn-modal-error').click();
              }, 1000);
            }
          });
      }
      else {
        this.utilitiesService.loading = false;
      }

    }
  }

  private generateUser(f: any, user: User) {
    let url = `${ environment.apiUrl }` + "confirm/credit";
    // console.log("url card-register-form.component.ts", url);

    let userRegister = {
      sistema: "Boletines Confa",
      linkMensaje: url,
      parametro: "34240997a16763c011134c570fcc149e",
      remitente: "Portal Confa",
      asunto: "Confirmación de registro",
      usuario: {
        documento: user.documento,
        direccion: user.direccion,
        telefono: user.telefono,
        sexo: user.sexo,
        categoria: user.categoria,
        celular: user.celular,
        correo: f.email.value,
        clave: f.password.value,
        codBeneficiario: user.codBeneficiario,
        nombreBeneficiario: user.nombreBeneficiario,
        fechaNacimiento: user.fechaNacimiento,
        fechaRegistro: user.fechaRegistro,
        documentoTrabajador: user.documento,
        primerNombre: f.firstName.value,
        segundoNombre: f.secondName.value,
        primerApellido: f.firstLastName.value,
        segundoApellido: f.secondLastName.value,
        link: url,
        existeUsuario: user.existeUsuario,
        usuarioNasfa: user.usuarioNasfa,
        sistemaActualizacion: user.sistemaActualizacion,
        correoMd5: "" + Md5.hashStr(f.email.value),
        aceptaHabeas: f.aceptHabeasData.value,
        tipoDocumento: user.tipoDocumento,
      }
    };

    return userRegister;
  }

}
