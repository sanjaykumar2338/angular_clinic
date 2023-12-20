import { Component, OnInit, HostListener } from "@angular/core";
import {
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
  FormGroup
} from "@angular/forms";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import * as $ from 'jquery';
import { environment } from "src/environments/environment";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.css"]
})

export class FooterComponent implements OnInit {
  emailRegex: any =
    "^[a-z0-9]+(.[_a-z0-9]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,15})$";
  blogposts: any;
  suburl = environment.apiUrl + "home/newsletter-subscribe";
  failedsub: any;
  subscribed: any;
  loading: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit() {

  }
}
