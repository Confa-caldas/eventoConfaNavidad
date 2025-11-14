import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CookieService } from "ngx-cookie-service";

import { environment } from 'src/environments/environment';
import { User, Token, UserRegister, RememberPassword } from '../interfaces/user.interface';

import { Md5 } from 'ts-md5/dist/md5';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private genericTokenSubject: BehaviorSubject<Token>;
  public genericToken: Observable<Token>;
  private currentTokenSubject: BehaviorSubject<Token>;
  public currentToken: Observable<Token>;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
  ) {
    this.loadTokens();
  }

  private loadTokens() {
    let gtoken = (this.cookieService.get('gtoken') !== '') ? JSON.parse(this.cookieService.get('gtoken')) : '';
    this.genericTokenSubject = new BehaviorSubject<Token>(gtoken);
    this.genericToken = this.genericTokenSubject.asObservable();

    let ptoken = (this.cookieService.get('ptoken') !== '') ? JSON.parse(this.cookieService.get('ptoken')) : '';
    this.currentTokenSubject = new BehaviorSubject<Token>(ptoken);
    this.currentToken = this.currentTokenSubject.asObservable();
  }

  public get genericTokenValue(): Token {
    return this.genericTokenSubject.value;
  }

  public get currentTokenValue(): Token {
    return this.currentTokenSubject.value;
  }

  private getQuery(query: string, bodyContent: any) {
    const url = `${ environment.apiIngresoConfa }${ query }`;
    const body = bodyContent;

    return this.http.post(url, body);
  }

  getToken(document: string, password: string) {
    let bodyToken = {
      "parametro1": '' + Md5.hashStr(document.toString()),
      "parametro2": '' + Md5.hashStr(password.toString()),
      "parametro3": "Web"
    }

    return this.getQuery('auth', bodyToken)
      // return this.http.get('assets/data/token.json')
      .pipe(map((response: Token) => {
        if (response.token) {
          this.cookieService.set('ptoken', JSON.stringify(response),1, '/',undefined, false,'Strict');
          this.currentTokenSubject.next(response);
        }
        return response;
      }));
  }

  getGenericToken() {
    let genericToken = {
      // "parametro1": "hlZTM4ZDcwNDRlODcyNzZDX1BPUlQqMjAxOCQ=",
      // "parametro2": "UG9ydGFsX0NvbmZhODRkZGZiMzQxMjZmYzNhND",
      "parametro1": `${ environment.parametro1 }`,
      "parametro2": `${ environment.parametro2 }`,
      "parametro3": "Web"
    }

    return this.getQuery('auth', genericToken)
      .pipe(map((response: Token) => {
        // console.log('gtoken',response.token)
        if (response.token) {
          this.cookieService.set('gtoken', JSON.stringify(response),1, '/',undefined, false,'Strict');
          this.genericTokenSubject.next(response);
        }
        return response;
      }));
  }

  // Login por usuario y contraseña
  // login(document: number, password: string) {
  //   let bodyValidate = {
  //     "documento": document.toString(),
  //     "clave": password.toString()
  //   }

  //   return this.getQuery('confa/metodo11', bodyValidate)
  //   // return this.http.get('assets/data/user.json')
  //     .pipe(map((response: User) => {
  //       return response;
  //     }));
  // }

  // Login por token
  login(token: string) {
    let bodyValidate = {
      "token": token.toString(),
    }

    return this.getQuery('confa/metodo23', bodyValidate)
    // return this.http.get('assets/data/user.json')
      .pipe(map((response: User) => {
        return response;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    // eliminar el usuario del almacenamiento local para cerrar la sesión del usuario
    this.cookieService.delete('gtoken');
    this.cookieService.delete('ptoken');
    this.cookieService.deleteAll();
    localStorage.removeItem('gtoken');
    localStorage.removeItem('ptoken');
    localStorage.removeItem('user');
    localStorage.removeItem('userOrCompany');

    this.currentTokenSubject.next(null);
    this.genericTokenSubject.next(null);
  }

  consultUserInformationNASFA(document: number) {
    let bodyUser = {
      "documento": document.toString(),
    }

    return this.getQuery('confa/metodo1', bodyUser)
      .pipe(map(response => {
        return response['usuario'];
      }));
  }

  consultUserInformationINCONFA(document: number) {
    let bodyUser = {
      "documento": document.toString(),
    }

    return this.getQuery('confa/metodo2', bodyUser)
      .pipe(map(response => {
        return response;
      }));
  }

  saveUser(userRegister: UserRegister) {
    return this.getQuery('confa/metodo12', userRegister)
      .pipe(map(response => {
        return response['respuesta'];
      }));
  }

  confirmUserRegistration(parametro: string) {
    let body = {
      "parametro": parametro.toString(),
      "correoMd5": ""
    }

    return this.getQuery('confa/metodo13', body)
      .pipe(map(response => {
        return response;
      }));
  }

  rememberPasswordDocumentUser(body: RememberPassword) {
    return this.getQuery('confa/metodo14', body)
      .pipe(map(response => {
        return response['respuesta'];
      }));
  }

  changePasswordNewUser(parametro: string, clave: string) {
    let body = {
      "parametro": parametro.toString(),
      "clave": clave.toString(),
      "sistema": "Portal confa"
    }

    return this.getQuery('confa/metodo16', body)
      .pipe(map(response => {
        return response['respuesta'];
      }));
  }

  validateToken(token: string) {
    let bodyValidateToken = {
      "token": token.toString(),
    }

    return this.getQuery('validarToken', bodyValidateToken)
      .pipe(map(response => {
        return response;
      }));
  }

  // loginLight(bodyLight: any) {
  //   let genericToken = {
  //     "parametro1": "hlZTM4ZDcwNDRlODcyNzZDX1BPUlQqMjAxOCQ=",
  //     "parametro2": "UG9ydGFsX0NvbmZhODRkZGZiMzQxMjZmYzNhND",
  //     "parametro3": "Web"
  //   }

  //   return this.getQuery('auth', genericToken)
  //     .pipe(map((response: Token) => {
  //       if(response.token) {

  //       }
  //       return response;
  //     }));
  // }

}
