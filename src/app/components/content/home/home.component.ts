import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  constructor() {}
  lista: any[] = [];
  termino: string;
  largo: number;
  ngOnInit(): void {}

  traerLenght(number: number) {
    this.largo = number;
  }

  traerTermino(termino: string) {
    this.termino = termino;
    /*  console.log(this.termino); */
  }
}
