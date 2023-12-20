import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NotificationService } from 'src/app/services/notification.service';
import { NursingService } from 'src/app/services/nursing.service';

@Component({
  selector: 'nursing-kardex',
  templateUrl: './nursing-kardex.component.html',
  styleUrls: ['./nursing-kardex.component.scss'],
})
export class NursingKardexComponent implements OnInit {
  asideState: any = {
    hidden: true,
  };
  sheetList: any = [];
  selectedNurse: any = null;
  showLoader: boolean = false;
  p = 1;
  imagePath: any = null; 
  moment = moment;
  searchText: string = '';
  constructor(
    private nursingSvc: NursingService,
    private notification: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getNursingKardex();
  }

  redirectToAddNewSheet() {
    this.router.navigate(['/nursing-kardex/add']);
  }

  trackByFn(index: number): any {
    return index;
  }


  getNursingKardex() {
    this.showLoader = true;
    this.nursingSvc.getKardexSheet().subscribe(
      (res: any) => {
        this.showLoader = false;
        this.sheetList = res.kardex;
      },
      (err: any) => {
        this.showLoader = false;
        this.notification.error('Algo salió mal');
      }
    );
  }

  gotoSelectedSheet(sheetId: any) {
    this.router.navigate(['/nursing-kardex/add'], { queryParams: { sheetId } });
  }

  get filteredRecords(): any[] {
    if (!this.searchText) {
      return this.sheetList;
    }
    return this.sheetList.filter((record: any) =>
      record.patientName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}
