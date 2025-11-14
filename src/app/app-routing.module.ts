import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Guards
import { AuthGuard } from "./_helpers/auth.guard";

import { HomeComponent } from "./components/content/home/home.component";
import { CrearComponent } from "./components/content/crear/crear.component";
import { ReportesComponent } from "./components/content/reportes/reportes.component";

// Components

const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "crear", component: CrearComponent },
  { path: "reportes", component: ReportesComponent },
  { path: "**", pathMatch: "full", redirectTo: "home" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
