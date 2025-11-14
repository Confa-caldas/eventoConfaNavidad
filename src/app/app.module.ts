import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

// Imports
import { CookieService } from "ngx-cookie-service";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// Interceptors
import { JwtInterceptor } from "./_helpers/jwt.interceptor";
import { ErrorInterceptor } from "./_helpers/error.interceptor";

// Routes
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

// Pipes
import { IndicationEmailPipe } from "./pipes/indication-email.pipe";

// Acordeon
import { AccordionModule } from "ngx-bootstrap/accordion";

// Components
import { FooterComponent } from "./components/shared/footer/footer.component";
import { LoadingComponent } from "./components/shared/loading/loading.component";
import { HeaderComponent } from "./components/shared/header/header.component";
import { NavbarComponent } from "./components/shared/navbar/navbar.component";

import { WelcomeComponent } from "./components/welcome/welcome.component";
import { CardLoginComponent } from "./components/card-login/card-login.component";
import { CardForgotPasswordComponent } from "./components/card-forgot-password/card-forgot-password.component";
import { CardRegisterComponent } from "./components/card-register/card-register.component";
import { CardChangePasswordComponent } from "./components/card-change-password/card-change-password.component";
import { CardRegisterFormComponent } from "./components/card-register-form/card-register-form.component";
import { ModalLoginComponent } from "./components/modal-login/modal-login.component";
import { ModalMessagesComponent } from "./components/modal-messages/modal-messages.component";
import { ModalContentComponent } from "./components/modal-content/modal-content.component";
import { ModalPoliciesComponent } from "./components/modal-policies/modal-policies.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { HomeComponent } from "./components/content/home/home.component";
import { FilterPipe } from "./pipes/filter.pipe";
import { ListaPersonasNavidadComponent } from "./components/content/lista-personas-navidad/lista-personas-navidad.component";
import { CrearComponent } from "./components/content/crear/crear.component";
import { ReportesComponent } from "./components/content/reportes/reportes.component";
import { WebcamModule } from "ngx-webcam";

@NgModule({
  declarations: [
    IndicationEmailPipe,
    AppComponent,
    FooterComponent,
    LoadingComponent,
    HeaderComponent,
    NavbarComponent,
    WelcomeComponent,
    CardLoginComponent,
    CardForgotPasswordComponent,
    CardRegisterComponent,
    CardChangePasswordComponent,
    CardRegisterFormComponent,
    ModalLoginComponent,
    ModalMessagesComponent,
    ModalContentComponent,
    ModalPoliciesComponent,
    HomeComponent,
    FilterPipe,
    ListaPersonasNavidadComponent,
    CrearComponent,
    ReportesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AccordionModule.forRoot(),
    WebcamModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    CookieService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
