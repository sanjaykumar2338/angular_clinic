import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatienceBalanceService } from 'src/app/services/patience-balance.service';

@Component({
  selector: 'patience-detail',
  templateUrl: './patience-detail.component.html',
  styleUrls: ['./patience-detail.component.scss'],
})
export class PatientDetailComponent implements OnInit {
    currentTab: number = 0;
    patientId: number = 0;
    patientDetail: any = {
      balance: []
    };
    constructor(private route: ActivatedRoute, private patientBalanceService: PatienceBalanceService) {
    }

    ngOnInit(): void {
      this.route.params.subscribe((params) => {
        this.patientId = params['id'];
        this.getPatientDetail();
      });
    }

    changeTab(tab: number) {
        this.currentTab = tab;
    }

    getPatientDetail() {
      this.patientBalanceService.getPatientBalance(this.patientId).subscribe((res: any) => {
        this.patientDetail = res.data;
    });
  }
}