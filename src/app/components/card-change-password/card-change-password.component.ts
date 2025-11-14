import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { UtilitiesService } from '../../services/utilities.service';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { User } from '../../interfaces/user.interface';
import { ValidatorsService } from '../../services/validators.service';
import { CookieService } from 'ngx-cookie-service';

declare var $;

@Component({
  selector: 'app-card-change-password',
  templateUrl: './card-change-password.component.html',
  styleUrls: ['./card-change-password.component.css']
})
export class CardChangePasswordComponent implements OnInit {

  formChangePassword: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private validatorsService: ValidatorsService,
    public activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    public utilitiesService: UtilitiesService,
    private cookieService: CookieService,
    private router: Router
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.showChangePassword();
  }

  createForm() {
    this.formChangePassword = this.formBuilder.group({
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      confirmPassword: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
    }, {
      validators: this.validatorsService.passwordsEquals('password', 'confirmPassword')
    });
  }

  get f() {
    return this.formChangePassword.controls;
  }

  get getPassword() {
    return this.formChangePassword.get('password').invalid && this.formChangePassword.get('password').touched;
  }

  get getConfirmPassword() {
    const password1 = this.formChangePassword.get('password').value;
    const password2 = this.formChangePassword.get('confirmPassword').value;
    return (password1 === password2) ? false : true;
  }

  changePassword() {
    // console.log("password", this.f.password.value.toString());
    // console.log("confirmPassword", this.f.confirmPassword.value.toString());

    if (this.formChangePassword.invalid) {
      Object.values(this.f)
        .forEach(control => {
          control.markAllAsTouched();
        });
      return;
    }
    else {
      this.utilitiesService.loading = true;
      if (this.f.password.value === this.f.confirmPassword.value) {
        let newPassword = this.f.password.value;

        let changePassword = this.activatedRoute.snapshot.queryParams['e541f24f0b06368c9cfb418174699da5'];
        if (changePassword) {
          this.authenticationService.changePasswordNewUser(changePassword, newPassword)
            .pipe(first())
            .subscribe((response: User) => {
              if (response) {
                // console.log("Cambio de contraseña éxitoso");
                this.utilitiesService.messageTitleModal = 'Cambio exitoso';
                this.utilitiesService.messageModal = 'Su contraseña ha cambiado con éxito.';
                this.utilitiesService.backLogin = true;

                $('.btn-close-popup-change-password').click();
                setTimeout(() => {
                  this.utilitiesService.loading = false;
                  $('.btn-modal-success').click();
                }, 1000);
              }
              else {
                // console.log("Cambio de contraseña fallido");
                this.utilitiesService.messageTitleModal = 'Cambio de contraseña fallido';
                this.utilitiesService.messageModal = 'Su cambio de contraseña ha fallado.';
                this.utilitiesService.backLogin = false;

                $('.btn-close-popup-change-password').click();
                setTimeout(() => {
                  this.utilitiesService.loading = false;
                  $('.btn-modal-error').click();
                }, 1000);
              }
            });
        }
        else {
          this.utilitiesService.messageTitleModal = 'El cambio de contraseña ha fallado'
          this.utilitiesService.messageModal = 'Las contraseñas no pudo ser cambiada.';
          this.utilitiesService.backLogin = false;

          setTimeout(() => {
            this.utilitiesService.loading = false;
            $('.btn-modal-error').click();
          }, 1000);
        }
      }
      else {
        // console.log("Contraseñas no coinciden");
        this.utilitiesService.messageTitleModal = 'El cambio de contraseña ha fallado';
        this.utilitiesService.messageModal = 'Las contraseñas no coinciden.';
        this.utilitiesService.backLogin = false;

        setTimeout(() => {
          this.utilitiesService.loading = false;
          $('.btn-modal-error').click();
        }, 1000);
      }

      this.formChangePassword.reset({
        password: '',
        confirmPassword: ''
      });

    }
  }

  showChangePassword() {
    let changePassword = this.activatedRoute.snapshot.queryParams['e541f24f0b06368c9cfb418174699da5'];
    if (changePassword) {
      this.cookieService.delete('gtoken');
      this.router.navigate(['/login'], { queryParams: { e541f24f0b06368c9cfb418174699da5: changePassword } });
      $('.btn-change-password').click();
    }
  }
}
