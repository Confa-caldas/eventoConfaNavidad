import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  HostListener,
  ElementRef,
  ViewEncapsulation,
} from "@angular/core";

import {
  listadoSeleccion,
  ListaPersonasPorDesayunarCV,
} from "src/app/interfaces/alojamiento.interface";
import { UtilitiesService } from "src/app/services/utilities.service";
import { NavidadService } from "src/app/services/navidad.service";
import {
  Asistente,
  AsistenteLdap,
  Asistentes,
  resValidaUser,
} from "src/app/interfaces/navidad.interface";
import { Subscription } from "rxjs";
import { Subject } from "rxjs";
import { Observable } from "rxjs";
import { WebcamImage, WebcamInitError, WebcamUtil } from "ngx-webcam";
import { first } from "rxjs/operators";

declare var $;

@Component({
  selector: "app-lista-personas-navidad",
  templateUrl: "./lista-personas-navidad.component.html",
  styleUrls: ["./lista-personas-navidad.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class ListaPersonasNavidadComponent implements OnInit {
  @ViewChild("modalFacial") modalFacial!: ElementRef;
  @ViewChild("buscarTexto") buscarTexto!: ElementRef;
  @Output() lenghtLista = new EventEmitter<number>();
  @Output() termino = new EventEmitter<string>();
  parametro: any;

  @ViewChild("buscarTexto") inputName;
  listado: ListaPersonasPorDesayunarCV[] = [];
  listaDesayunados: ListaPersonasPorDesayunarCV[] = [];
  listaMostrarVista: ListaPersonasPorDesayunarCV[] = [];
  asistentes: Asistente[] = [];
  listaAsistentes: Asistentes[];
  listaSeleccion: listadoSeleccion[] = [];
  timerSubscription: Subscription;
  resBusqueda: boolean = false;
  resBeneficios: boolean = false;
  beneficiosCheckbox = [
    { id: "1", aplica: "NO" },
    { id: "2", aplica: "NO" },
    { id: "3", aplica: "NO" },
    { id: "4", aplica: "NO" },
    { id: "5", aplica: "NO" },
    { id: "6", aplica: "NO" },
    { id: "7", aplica: "NO" },
    { id: "8", aplica: "NO" },
  ];

  //Variables para el reconocimiento facial
  public showWebcam = false;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  videoOptions: any = {}; // Configuración de video
  public errors: WebcamInitError[] = [];
  public width: number;
  public height: number;
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<
    boolean | string
  >();
  pictureTaken: WebcamImage;
  private usuEn: AsistenteLdap;

  constructor(
    private navidadService: NavidadService,
    public utilitiesService: UtilitiesService
  ) {
    this.usuEn = null;
    this.onResize();
  }

  @HostListener("window:resize", ["$event"])
  onResize(event?: Event) {
    const win = !!event ? (event.target as Window) : window;
    if (win.innerWidth < 768) {
      this.width = win.innerWidth - 20;
      this.height = win.innerHeight - 20;
    } else {
      this.width = win.innerWidth / 2;
      this.height = win.innerHeight / 2;
    }
  }

  ngOnInit(): void {
    if (this.navidadService.listaAsistentes == null) {
      this.utilitiesService.loading = true;
      this.consultarAsistentes(); // load data contains the http request
    } else {
      this.listaAsistentes = this.navidadService.listaAsistentes;
    }
    this.selectBackCamera();
  }

  async selectBackCamera() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      // Busca una cámara trasera
      const backCamera = videoDevices.find(
        (device) =>
          device.label.toLowerCase().includes("back") ||
          device.label.toLowerCase().includes("trasera")
      );

      if (backCamera) {
        this.videoOptions = {
          video: { deviceId: { exact: backCamera.deviceId } }, // Selecciona la cámara trasera
        };
        console.log("Cámara trasera seleccionada:", backCamera.label);
      } else {
        console.warn(
          "No se encontró una cámara trasera. Usando la cámara predeterminada."
        );
        this.videoOptions = { video: true }; // Configuración predeterminada
      }
    } catch (error) {
      console.error("Error al acceder a las cámaras:", error);
      this.videoOptions = { video: true }; // Fallback
    }
  }

  listarPersonas(terminoBusqueda: string) {
    this.utilitiesService.loading = true;
    this.listaMostrarVista = [];
    this.listado = [];
    this.listaDesayunados = [];
    this.parametro = terminoBusqueda;
    this.termino.emit(terminoBusqueda);

    this.asistentes = [];

    if (terminoBusqueda != "" && terminoBusqueda != " ") {
      // let documento: String[] = terminoBusqueda.split("_");
      // let numeroCedula: String;
      // if (documento.length > 1) {
      //   numeroCedula = documento[2];
      // } else {
      //   numeroCedula = documento[0];
      // }
      this.consultarAsistentePorDocumento(terminoBusqueda);
      this.lenghtLista.emit(this.listaMostrarVista.length);
    } else {
      this.utilitiesService.loading = false;
    }
  }

  consultarAsistentes() {
    this.navidadService
      .consultarAsistentes()
      .subscribe((response: Asistentes[]) => {
        this.navidadService.listaAsistentes = response;
        this.listaAsistentes = response;
        this.utilitiesService.loading = false;
      });
  }

  consultarAsistentePorDocumento(parametro: String) {
    this.navidadService
      .consultarAsistentePorCedula(parametro)
      .subscribe((response: Asistente) => {
        if (response["documento"] != "") {
          console.log(response);
          this.resBusqueda = false;
          this.resBeneficios = false;
          this.asistentes.push(response);
          this.createForm(this.asistentes);
          this.utilitiesService.loading = false;
          this.beneficiosCheckbox = [
            { id: "1", aplica: "NO" },
            { id: "2", aplica: "NO" },
            { id: "3", aplica: "NO" },
            { id: "4", aplica: "NO" },
            { id: "5", aplica: "NO" },
            { id: "6", aplica: "NO" },
            { id: "7", aplica: "NO" },
            { id: "8", aplica: "NO" },
          ];
          response["beneficios"].forEach((beneficio) => {
            if (beneficio["estado"] == "1") {
              this.resBeneficios = true;
            }
          });
        } else {
          this.resBusqueda = true;
          this.utilitiesService.loading = false;
        }
      });
  }

  createForm(asistentes: Asistente[]) {}

  limpiarBusqueda() {
    this.inputName.nativeElement.value = " ";
    this.asistentes = [];
    this.resBusqueda = false;
    this.resBeneficios = false;
    this.usuEn = null;
  }

  entregarBeneficio(documento: String) {
    this.utilitiesService.loading = true;
    this.navidadService
      .usarBeneficio(
        documento,
        this.beneficiosCheckbox[0].aplica,
        this.beneficiosCheckbox[1].aplica,
        this.beneficiosCheckbox[2].aplica,
        this.beneficiosCheckbox[3].aplica,
        this.beneficiosCheckbox[4].aplica,
        this.beneficiosCheckbox[5].aplica,
        this.beneficiosCheckbox[6].aplica,
        this.beneficiosCheckbox[7].aplica
      )
      .subscribe((response: JSON) => {
        if (response["respuesta"] == true) {
          this.utilitiesService.messageTitleModal =
            "Usuario actualizado correctamente";
          this.utilitiesService.messageModal =
            "Se ha actualizado el usuario correctamente";
          setTimeout(() => {
            this.utilitiesService.loading = false;
            $(".btn-modal-success").click();
            this.asistentes = [];
            this.inputName.nativeElement.value = " ";
          }, 1000);
        } else {
          this.utilitiesService.messageTitleModal =
            "Error actualizando el usuario";
          this.utilitiesService.messageModal = "Por favor intenta de nuevo";
          setTimeout(() => {
            this.utilitiesService.loading = false;
            $(".btn-modal-error").click();
          }, 1000);
        }
      });
  }

  toggleEditable(event, idBeneficio: String) {
    if (event.target.checked) {
      this.beneficiosCheckbox.forEach((bene) => {
        if (bene.id == idBeneficio) {
          bene.aplica = "SI";
        }
      });
    } else {
      this.beneficiosCheckbox.forEach((bene) => {
        if (bene.id == idBeneficio) {
          bene.aplica = "NO";
        }
      });
    }
  }

  registroFacial() {
    this.showWebcam = true;
    $(".btn-camara").click();
  }
  closeModalFacial() {
    this.showWebcam = false;
  }

  public triggerSnapshot(): void {
    this.utilitiesService.loading = true;
    this.trigger.next();
    /*   this.closeModalFacial(); */
  }
  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }
  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }
  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }
  public handleImage(webcamImage: WebcamImage): void {
    //console.info("received webcam image", webcamImage);
    this.pictureTaken = webcamImage;
    this.validateFaceLDAP(); // Este login realiza el reconocimineto facial desde el ws de capacitaciones, se evia imagen base 64 al ws
    /*  this.validateFace(); */ //Este login realiza el reconocimiento facial desde el angular y el documento se envia al ws de capacitaciones
  }
  public cameraWasSwitched(deviceId: string): void {
    // console.log("active device: " + deviceId);
    this.deviceId = deviceId;
  }
  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }
  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  validateFaceLDAP() {
    this.usuEn = null;
    this.navidadService
      .validarRostroLDAP(this.pictureTaken.imageAsBase64)
      .pipe(first())
      .subscribe((response: resValidaUser) => {
        if (response.salida == "OK" && response.estado == 1) {
          $(".btn-close-camara").click();
          setTimeout(() => {
            this.utilitiesService.messageTitleModal = "Resultado validación";
            this.utilitiesService.messageModal = `
    <span>
        <strong>Nombre:</strong>
        <span class="variable-style">${response.asistente.nombre}</span><br><br>
        <strong>CC:</strong>
        <span class="variable-style">${response.asistente.documento}</span>
    </span>
`;
            this.utilitiesService.backLogin = false;
            this.usuEn = response.asistente;
            setTimeout(() => {
              this.utilitiesService.loading = false;
              $(".btn-modal-success-facial").click();
            }, 1000);
          }, 1000);
        } else {
          $(".btn-close-camara").click();
          this.utilitiesService.messageTitleModal = response.error;
          this.utilitiesService.messageModal = "";
          this.utilitiesService.backLogin = false;
          setTimeout(() => {
            this.utilitiesService.loading = false;
            $(".btn-modal-error").click();
          }, 1000);
          this.closeModalFacial();
        }
      });
  }

  buscarPersonaFacial() {
    if (this.usuEn != null && this.usuEn.documento != "") {
      // this.listarPersonas(this.usuEn.documento);

      this.inputName.nativeElement.value = this.usuEn.documento;
      setTimeout(() => {
        this.buscarTexto.nativeElement.focus();
        setTimeout(() => {
          this.buscarTexto.nativeElement.click();
        }, 1000);
      }, 0);

      //Otra opcion sugerida por tec_luisda
      // const documentoBase = this.usuEn.documento;
      // let documentoConVariante = "";

      // for (let i = 1; i <= this.asistentes.length; i++) {
      //   const documentoActual = `${documentoBase}-${i}`;
      //   const asistente1 = this.asistentes.find(
      //     (a) => a.documento === documentoActual
      //   );
      //   console.log("El asistente es:" + asistente1);
      //   if (asistente1) {
      //     const beneficioConEstado1 = asistente1.beneficios?.find(
      //       (b) => b.estado === "1"
      //     );
      //     console.log(beneficioConEstado1);
      //     if (beneficioConEstado1) {
      //       documentoConVariante = documentoActual;
      //       break;
      //     }
      //   }
      // }
      // if (documentoConVariante) {
      //   this.listarPersonas(documentoConVariante);
      // }
    }
  }
}
