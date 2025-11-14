import { Injectable } from "@angular/core";

import { User } from "../interfaces/user.interface";
import * as moment from "moment";
import { BehaviorSubject, Observable } from "rxjs";
import { ListaPersonasPorDesayunarCV } from "../interfaces/alojamiento.interface";

@Injectable({
  providedIn: "root",
})
export class UtilitiesService {
  private messageSource = new BehaviorSubject<string>("");

  // Loading
  loading: boolean = false;
  messageLoading: string = null;

  // Modal
  messageTitleModal: string = null;
  messageModal: string = null;
  backLogin: boolean = false;
  errorInfoLogin: string =
    "El usuario no se encuentra registrado o alguno de los dos datos es incorrecto.";

  // User
  currentUser: User;
  fullNameUser: string;
  documentUser: string;
  registerUser: User;
  existUser: boolean = false;
  recoveryEmail: string;
  nasfaUser: User;

  dues: any = null;
  returnUrl: string = null;
  subserviceCode: number = null;

  colorTransaction: string = null;

  constructor() {}

  convertDateFormat(_date: any, _format: string) {
    const year = _date.year;
    const month = _date.month;
    const day = _date.day;

    let date = year + "/" + month + "/" + day;

    if (year && month && day) {
      return moment(date).format(_format);
    } else {
      return moment(_date).format(_format);
    }
  }

  setCodeTransactionStatus(code: string) {
    switch (code) {
      case "OK":
        this.messageModal = "Transacción aprobada por la entidad financiera";
        break;
      case "NOT_AUTHORIZED":
        this.messageModal = "Transacción no aprobada por la entidad financiera";
        break;
      case "EXPIRED":
        this.messageModal = "Transacción expirada";
        break;
      case "FAILED":
        this.messageModal =
          "Se ha presentado un fallo en la comunicación con la entidad financiera";
        break;
      case "PENDING":
        this.messageModal =
          "Tu transacción está pendiente de aprobación por tu entidad financiera";
        break;
      case "BANK":
        this.messageModal =
          "Se ha presentado un fallo en la comunicación con la entidad financiera";
        break;
    }
  }

  sendMessage(message: any) {
    this.messageSource.next(message);
    /*  console.log("UtilitiesServices",this.messageSource); */
  }

  receivedMessage(): Observable<any> {
    return this.messageSource.asObservable();
  }
}
