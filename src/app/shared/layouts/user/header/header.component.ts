import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as $ from 'jquery';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  logeduser: any;
  logedname: any;
  showmenu: boolean = false;
  showmenu1: boolean = false;
  siteUrl = 'https://walldirectory.com/';
  siteUrl2 = environment.sitepath;
  listregions = environment.apiUrl + 'listings/regions';
  listofregion: any;
  usertype = '';
  logtype: any;
  isLoggedIn = '';

  menutoggle = {
    tb1: false,
    tb2: false,
    tb3: false,
    tb4: false,
  };
  parent = '';
  loggedInUser: any;
  clinicDetail: any;
  constructor(
    public fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private http: HttpClient
  ) {
    if (window.innerWidth <= 991) {
      $('body').find('.offcanvas.offcanvas-start').removeClass('show');
      $('body').addClass('full_content');
    }
  }

  ngOnInit() {
    this.loggedInUser = this.authService.getUserDetail();
    this.clinicDetail = this.authService.getClinicDetail();
  }

  toggleBody() {
    $('body').toggleClass('full_content');
    if ($('body').hasClass('full_content')) {
      $('offcanvas-start').removeClass('show');
    } else {
      $('offcanvas-start').addClass('show');
    }
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, true);
  }

  isNurse() {
    if (this.loggedInUser && this.loggedInUser.user_type == 'nurse') {
      return true;
    } else {
      return false;
    }
  }
}
