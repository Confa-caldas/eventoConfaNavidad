import { Injectable } from "@angular/core";
import { Asistentes } from "../interfaces/navidad.interface";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class NavidadService {
  listaAsistentes: Asistentes[];
  private messageSource = new BehaviorSubject<string>("");

  constructor(private http: HttpClient) {}

  sendMessage(message: string) {
    this.messageSource.next(message);
  }

  receivedMessage(): Observable<string> {
    return this.messageSource.asObservable();
  }

  consultarAsistentePorCedula(numeroCedula: String) {
    const url = `${environment.apiEventoNavidad}metodo1?documento=${numeroCedula}`;
    return this.http.get(url);
  }

  usarBeneficio(
    numeroCedula: String,
    beneficio1: String,
    beneficio2: String,
    beneficio3: String,
    beneficio4: String,
    beneficio5: String,
    beneficio6: String,
    beneficio7: String,
    beneficio8: String
  ) {
    const url = `${environment.apiEventoNavidad}metodo2?documento=${numeroCedula}&beneficio1=${beneficio1}&beneficio2=${beneficio2}&beneficio3=${beneficio3}&beneficio4=${beneficio4}&beneficio5=${beneficio5}&beneficio6=${beneficio6}&beneficio7=${beneficio7}&beneficio8=${beneficio8}`;
    return this.http.get(url);
  }

  guardarAsistente(body: any) {
    const url = `${environment.apiEventoNavidad}metodo3`;
    return this.http.post(url, body);
  }

  consultarAsistencia() {
    const url = `${environment.apiEventoNavidad}metodo4`;
    return this.http.get(url);
  }

  consultarEntregaBeneficio() {
    const url = `${environment.apiEventoNavidad}metodo5`;
    return this.http.get(url);
  }

  consultarAsistentes() {
    const url = `${environment.apiEventoNavidad}metodo6`;
    return this.http.get(url);
  }

  private getQueryPost(query: string, bodyContent: any) {
    const url = `${environment.apiEventoNavidad}${query}`;
    const body = bodyContent;
    return this.http.post(url, body);
  }

  validarRostroLDAP(imagen: string) {
    let body = {
      imgdata: imagen,
    };
    return this.getQueryPost("metodo7", body);
  }
}
