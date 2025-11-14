import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { AuthenticationService } from "../services/authentication.service";
import { UtilitiesService } from "../services/utilities.service";
declare var $;

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService,
    public utilitiesService: UtilitiesService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        console.log(err.status);
        if (err.status === 401) {
          // auto logout if 401 response returned from api
          // cierre de sesión automático si se devuelve la respuesta 401 de la api
          this.authenticationService.logout();
          location.reload(true);
        } else if (err.status == 0) {
          this.utilitiesService.messageTitleModal = "Error de conectividad";
          this.utilitiesService.messageModal = "Por favor intenta nuevamente";
          setTimeout(() => {
            this.utilitiesService.loading = false;
            $(".btn-modal-error").click();
          }, 1000);
        }

        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}
