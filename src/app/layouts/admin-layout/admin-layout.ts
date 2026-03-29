import { Component } from "@angular/core";
import { RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router";
import { NavbarComponent } from "../../features/shared/components/navbar/navbar";

@Component({
  selector: "app-admin-layout",
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NavbarComponent],
  templateUrl: "./admin-layout.html",
  styleUrls: ["./admin-layout.scss"],
})
export class AdminLayout {}
