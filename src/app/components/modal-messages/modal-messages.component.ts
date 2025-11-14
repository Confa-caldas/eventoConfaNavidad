import { Component, OnInit } from "@angular/core";

import { UtilitiesService } from "../../services/utilities.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "../../services/authentication.service";
import { User } from "../../interfaces/user.interface";
import { first } from "rxjs/operators";

declare var $;

@Component({
  selector: "app-modal-messages",
  templateUrl: "./modal-messages.component.html",
  styleUrls: ["./modal-messages.component.css"],
})
export class ModalMessagesComponent implements OnInit {
  constructor(
    public utilitiesService: UtilitiesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) {
    this.confirmUser();
  }

  ngOnInit() {}

  confirmUser() {
    let confirmUser =
      this.activatedRoute.snapshot.queryParams[
        "34240997a16763c011134c570fcc149e"
      ];
    if (confirmUser) {
      this.utilitiesService.loading = true;
      this.authenticationService
        .confirmUserRegistration(confirmUser)
        .pipe(first())
        .subscribe((response: User) => {
          if (response.documento !== "") {
            // console.log(response);
            this.utilitiesService.messageTitleModal = "Registro exitoso";
            this.utilitiesService.messageModal =
              "Confirmación de registro exitoso.";
            this.utilitiesService.backLogin = true;

            setTimeout(() => {
              this.utilitiesService.loading = false;
              $(".btn-modal-success").click();
            }, 1000);
          } else {
            this.utilitiesService.messageTitleModal = "Registro fallido";
            this.utilitiesService.messageModal =
              "La confirmación de registro no fue exitosa o ya ha sido confirmada.";
            this.utilitiesService.backLogin = true;

            setTimeout(() => {
              this.utilitiesService.loading = false;
              $(".btn-modal-error").click();
            }, 1000);
          }
        });
    }
  }

  // reloadCurrentPage() {
  //   window.location.reload();
  // }

  backLogin(success: boolean) {
    let confirmUser =
      this.activatedRoute.snapshot.queryParams[
        "34240997a16763c011134c570fcc149e"
      ];
    if (confirmUser && success) {
      this.router.navigate(["/login"]);
    }

    let changePassword =
      this.activatedRoute.snapshot.queryParams[
        "e541f24f0b06368c9cfb418174699da5"
      ];
    if (changePassword && success) {
      this.router.navigate(["/login"]);
    }

    if (success) {
      this.authenticationService.logout();
      this.router.navigate(["/login"]);
    }
    this.utilitiesService.recoveryEmail = null;
  }

  navigatecreditsimulador() {
    this.router.navigate(["/home"]);
  }

  reload() {
    window.location.reload();
  }
}
