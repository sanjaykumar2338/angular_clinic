import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
  FormGroup
} from "@angular/forms";
import { AuthService } from "./../../../../auth/auth.service";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import * as $ from 'jquery';
import { environment } from "src/environments/environment";

@Component({
  selector: "app-superadminheader",
  templateUrl: "./superadminheader.component.html",
  styleUrls: ["./superadminheader.component.css"]
})
export class SuperAdminHeaderComponent implements OnInit {
  logeduser: any;
  logedname: any;
  showmenu: boolean = false;
  showmenu1: boolean = false;
  siteUrl = "https://walldirectory.com/";
  siteUrl2 = environment.sitepath;
  listregions = environment.apiUrl + "listings/regions";
  listofregion: any;
  usertype = "";
  logtype: any;
  isLoggedIn = "";
  user: any;

  menutoggle = {
    tb1: false,
    tb2: false,
    tb3: false,
    tb4: false
  };
  parent = "";

  constructor(
    public fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private logedUser: AuthService,
    private http: HttpClient
  ) { 

    if (window.innerWidth <= 991) {
      $(".offcanvas.offcanvas-start").removeClass("show");
      $("body").addClass("full_content");    
	  }

    const data = localStorage.getItem('logger_user') || '{}';
    this.user = JSON.parse(data);
  }

  ngOnInit() {

  }

  onLogout(){
    this.router.navigate(['/logout']);
  }

  redirectToPage(route: string) {
    this.router.navigate([route]);
  }
}
