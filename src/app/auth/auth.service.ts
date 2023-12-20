import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  isLoggedIn: any;
  freeopt: any;

  constructor(private router: Router, private http: HttpClient) {}

  getUser(): string {
    return window.localStorage.getItem("logedUser") || '{}';
  }

  getUsername(): string {
    return window.localStorage.getItem("logedname") || '{}';
  }

  getToken(): string {
    return window.localStorage.getItem("token") || '{}';
  }

  getUserType(): string {
    return window.localStorage.getItem("usertype") || '{}';
  }

  getUserReferral(): string {
    return window.localStorage.getItem("userlog") || '{}';
  }

  getChoosePackage(): string {
    return window.localStorage.getItem("package") || '{}';
  }

  logout() {
    localStorage.clear();
    this.router.navigate(["/"]);
  }

  guser() {
    sessionStorage.setItem("userid", localStorage.getItem("logedUser") || '{}');
    return sessionStorage.getItem("userid");
  }
  gtoken() {
    sessionStorage.setItem("usertoken", localStorage.getItem("token") || '{}');
    return sessionStorage.getItem("usertoken");
  }
}
