import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NotificationService } from 'src/app/services/notification.service';
import { NursingService } from 'src/app/services/nursing.service';

@Component({
  selector: 'nursing-sheet',
  templateUrl: './nursing-sheet.component.html',
  styleUrls: ['./nursing-sheet.component.scss'],
})
export class NursingSheetComponent implements OnInit {
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
    this.getNursingSheets();
  }

  redirectToAddNewSheet() {
    this.router.navigate(['/nursing-sheet/add']);
  }


  gotoSelectedSheet(sheetId: any) {
    this.router.navigate(['/nursing-sheet/add'], { queryParams: { sheetId } });
  }

  trackByFn(index: number): any {
    return index;
  }

  getNursingSheets() {
    this.showLoader = true;
    this.nursingSvc.getNursingSheets().subscribe(
      (res: any) => {
        this.showLoader = false;
        this.sheetList = res.nursingsheet;
      },
      (err: any) => {
        this.showLoader = false;
        this.notification.error('Algo salió mal');
      }
    );
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
