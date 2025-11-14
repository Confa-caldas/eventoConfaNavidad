import { Component, OnInit } from "@angular/core";
import { NavidadService } from "src/app/services/navidad.service";
import { UtilitiesService } from "src/app/services/utilities.service";

@Component({
  selector: "app-reportes",
  templateUrl: "./reportes.component.html",
  styleUrls: ["./reportes.component.css"],
})
export class ReportesComponent implements OnInit {
  reporteAsistentes: JSON[] = [];
  reporteBeneficios: JSON[] = [];

  constructor(
    private navidadService: NavidadService,
    public utilitiesService: UtilitiesService
  ) {}

  ngOnInit(): void {
    this.utilitiesService.loading = true;
    this.consultarAsistencia();
    this.consultarEntregaBeneficio();
    this.utilitiesService.loading = false;
  }

  consultarAsistencia() {
    this.navidadService.consultarAsistencia().subscribe((response: JSON[]) => {
      console.log(response);
      // this.reporteAsistentes = response;
      this.reporteAsistentes = response.filter(
        (item: any) => item.etiqueta === "COLABORADOR"
      );
    });
  }

  consultarEntregaBeneficio() {
    this.navidadService
      .consultarEntregaBeneficio()
      .subscribe((response: JSON[]) => {
        //this.reporteBeneficios = response;
        this.reporteBeneficios = response.filter(
          (item: any) =>
            item.etiqueta === "BONO REGALO" || item.etiqueta === "REGALO"
        );
      });
  }
}
