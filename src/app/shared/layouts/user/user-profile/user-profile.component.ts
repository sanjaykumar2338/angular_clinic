import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";

@Component({
    selector: 'user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss']
})


export class UserProfileComponent implements OnInit {
    userDetail: any = null;
    clinicDetail: any = null;

    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.userDetail = this.authService.getUserDetail();
        this.clinicDetail = this.authService.getClinicDetail();
    }
}
