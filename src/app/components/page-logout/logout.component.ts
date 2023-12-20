import { Component, OnInit } from "@angular/core";
import { Routes, RouterModule, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-logout",
  templateUrl: "./logout.component.html",
  styleUrls: ["./logout.component.css"]
})
export class LogoutComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    localStorage.clear();
    this.router.navigate(["/"]);
    //window.location.href = environment.sitepath;
  }
}
