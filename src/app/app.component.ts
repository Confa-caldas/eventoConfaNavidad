import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
} from "@angular/core";

import { UtilitiesService } from "./services/utilities.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, AfterContentChecked {
  constructor(
    public utilitiesService: UtilitiesService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}
  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }
  onActivate(event: any) {
    window.scrollTo(0, 0);
  }
}
