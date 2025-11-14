import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { first } from 'rxjs/operators';
import { User, Token, UserOrCompany } from '../../interfaces/user.interface';
import { UtilitiesService } from '../../services/utilities.service';
import { CookieService } from 'ngx-cookie-service';

declare var $;

@Component({
  selector: 'app-card-login',
  templateUrl: './card-login.component.html',
  styleUrls: ['./card-login.component.css']
})
export class CardLoginComponent implements OnInit {

  formLogin: FormGroup;
  returnUrl: string;
  @Output() formLoginEmitter: EventEmitter<FormGroup> = new EventEmitter();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    public utilitiesService: UtilitiesService,
    private cookieService: CookieService,
  ) {
    this.createForm();
  }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    // obtener retorno de los parametros route de la url o por defecto a '/'
    this.returnUrl =  `/home`;
    // console.log('returnUrl', this.returnUrl);

    this.formLoginEmitter.emit(this.formLogin);
  }

  createForm() {
    this.formLogin = this.formBuilder.group({
      document: ['', [
        Validators.required,
        Validators.min(99999),
        Validators.max(999999999999999),
        Validators.pattern("^[0-9]+")
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]
    });
  }

  // convenience getter for easy access to form fields
  // un práctico buscador para facilitar el acceso a los campos de los formularios
  get f() {
    return this.formLogin.controls;
  }

  get getDocument() {
    return this.formLogin.get('document').invalid && this.formLogin.get('document').touched;
  }

  get getPassword() {
    return this.formLogin.get('password').invalid && this.formLogin.get('password').touched;
  }

  onSubmit() {
    // stop here if form is invalid
    // Deténgase aquí si el formulario no es válido
    if (this.formLogin.invalid) {
      Object.values(this.f)
        .forEach(control => {
          control.markAllAsTouched();
        });
      return;
    }
    else {
      let document = this.f.document.value;
      let password = this.f.password.value;

      // this.authenticationService.getGenericToken()
      //   .pipe(first())
      //   .subscribe((response: Token) => {
      //     console.log("token generic", response);
      //   });

      if (document !== '' && password !== '') {

        this.utilitiesService.messageLoading = null;
        this.utilitiesService.loading = true;

        this.authenticationService.getToken(document, password)
          .pipe(first())
          .subscribe((response: Token) => {
            // console.log("response: ", response);
            if (response.token) {

              // this.authenticationService.login(document, password)
              this.authenticationService.login(response.token)
                .pipe(first())
                .subscribe((response: User) => {
                  this.utilitiesService.currentUser = response;
                  // console.log(response);
                  if (response.existeUsuario) {

                    let userOrCompany: UserOrCompany = {
                      documentType: response.tipoDocumento,
                      document: parseInt(response.documento),
                      // dateBirthday: response.fechaNacimiento
                    };

                    localStorage.setItem('userOrCompany', JSON.stringify(userOrCompany));
                    this.cookieService.delete('gtoken');
                    this.utilitiesService.messageLoading = `Bienvenido ${response.primerNombre} ${response.segundoNombre} ${response.primerApellido} ${response.segundoApellido}`;
                    // console.log(this.utilitiesService.messageLoading);
                    this.utilitiesService.fullNameUser = response.primerNombre + " " + response.segundoNombre + " " + response.primerApellido + " " + response.segundoApellido;
                    this.utilitiesService.documentUser = response.documento;

                    $('.btn-close-popup-login').click();
                    setTimeout(() => {
                      this.utilitiesService.loading = false;
                      this.router.navigate([this.returnUrl]);
                    }, 500);
                  }
                });

              this.formLogin.reset({
                document: '',
                password: ''
              });
            }
            else {
              // this.utilitiesService.messageTitleModal = response.mensaje;
              // console.log(response.mensaje);
              this.utilitiesService.messageTitleModal = 'Inténtalo nuevamente';
              this.utilitiesService.messageModal = this.utilitiesService.errorInfoLogin;
              this.utilitiesService.backLogin = false;

              setTimeout(() => {
                this.utilitiesService.loading = false;
                $('.btn-modal-error').click();
              }, 500);
            }
          });
      }

    }
  }

}
