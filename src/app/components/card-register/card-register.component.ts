import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { AuthenticationService } from '../../services/authentication.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { User, Token } from '../../interfaces/user.interface';
import { UtilitiesService } from '../../services/utilities.service';
import { CookieService } from 'ngx-cookie-service';

declare var $;

@Component({
  selector: 'app-card-register',
  templateUrl: './card-register.component.html',
  styleUrls: ['./card-register.component.css']
})
export class CardRegisterComponent implements OnInit {

  formValidate: FormGroup;
  @Output() formValidateEmitter: EventEmitter<FormGroup> = new EventEmitter();

  constructor(
    private autheticationService: AuthenticationService,
    public utilitiesService: UtilitiesService,
    private cookieService: CookieService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.formValidateEmitter.emit(this.formValidate);
  }

  createForm() {
    this.formValidate = new FormGroup({
      "document": new FormControl('', [
        Validators.required,
        Validators.min(99999),
        Validators.max(999999999999999),
        Validators.pattern("^[0-9]+")
      ]),
    });
  }

  get f() {
    return this.formValidate.controls;
  }

  get getDocument() {
    return this.formValidate.get('document').invalid && this.formValidate.get('document').touched;
  }

  validateDocument() {
    if (this.formValidate.invalid) {
      Object.values(this.f)
        .forEach(control => {
          control.markAllAsTouched();
        });
      return;
    }
    else {
      let document = this.f.document.value;
      // console.log(document);

      if (document !== '') {
        this.utilitiesService.loading = true;

        this.autheticationService.getGenericToken()
          .pipe(first())
          .subscribe((response: Token) => {
            // console.log("Token generico", response);

            if (response.token) {
              this.autheticationService.consultUserInformationNASFA(document)
                .pipe(first())
                .subscribe((response: User) => {
                  this.utilitiesService.registerUser = response;
                  this.utilitiesService.existUser = response.existeUsuario || response.usuarioNasfa;
                  // console.log("this.utilitiesService.existUser", this.utilitiesService.existUser);

                  if (!response.existeUsuario) {
                    this.utilitiesService.loading = false;
                    // console.log('Usuario no encontrado');

                    $('.btn-close-popup-login').click();
                    setTimeout(() => {
                      $('.btn-form-register').click();
                    }, 500);
                  }
                  else {
                    this.utilitiesService.loading = false;

                    // console.log('Usuario encontrado');
                    this.cookieService.delete('gtoken');
                    this.utilitiesService.messageTitleModal = 'Documento registrado';
                    this.utilitiesService.messageModal = 'Este usuario ya se encuentra registrado.';
                    this.utilitiesService.backLogin = false;

                    $('.btn-modal-error').click();
                  }
                });
            }
          });
      }

      this.formValidate.reset({
        document: ''
      });

    }
  }

}
