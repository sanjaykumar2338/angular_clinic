import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ClinicBalanceService } from 'src/app/services/clinic-balance.service';
import {WorkSheet, utils, WorkBook, writeFile} from 'xlsx';

@Component({
  selector: 'clinic-transaction',
  templateUrl: './clinic-transaction.component.html',
  styleUrls: ['./clinic-transaction.component.scss'],
})
export class ClinicTransactionComponent implements OnInit {
  public transactions: any[] = [];
  page: number = 1;
  dateRange: any = {
    from: moment().subtract(1, 'month').format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD'),
  };
  datePickerOptions: any = {
    locale: { format: 'YYYY-MM-DD',
    daysOfWeek: [
      "Do",
      "Lu",
      "Ma",
      "Mi",
      "Ju",
      "Vi",
      "Sa"
    ], 
    monthNames: [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "Mayo",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic"
    ] },
    alwaysShowCalendars: false,
    autoApply: true,
    startDate: moment().subtract(1, 'month'),
    endDate: moment()
  };
  responseData: any = [];
  showLoader: boolean = false;
  constructor(private clinicBalanceSvc: ClinicBalanceService) {}

  ngOnInit(): void {
    this.getClinicTxns();
  }

  getClinicTxns() {
    this.showLoader = true;
    this.clinicBalanceSvc.getClinicTxns(this.dateRange).subscribe((res: any) => {
      this.transactions = res.data;
      this.responseData = res.data;
      this.showLoader = false;
    }, (err: any) => {
      this.showLoader = false;
    });
  }

  trackByFn(index: number): any {
    return index;
  }
  selectedDate(value: any) {
    this.dateRange = {
      from: moment(value.start).format('YYYY-MM-DD'),
      to: moment(value.end).format('YYYY-MM-DD'),
    };
    this.getClinicTxns();
  }

  filterBy(event: any) {
    switch (event.target.value) {
      case "1":
        this.transactions = this.responseData.filter((txn: any) => txn.type == 'revenue');
        break;
      case "2":
        this.transactions = this.responseData.filter((txn: any) => txn.type == 'expenses');
        break;      
    
      default:
        this.transactions = this.responseData;
        break;
    }
  }

  exportToExcel(): void {
    const sheetToDownload = this.transactions.map((item: any) => {
      return {
        Date: moment(item.date).format('YYYY-MM-DD'),
        Type: item.type,
        Concept: item.payment_purpose,
        Amount: item.amount,
        Comments: item.comments,
      };
    });
    const ws: WorkSheet = utils.json_to_sheet(sheetToDownload);
    const wb: WorkBook = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Sheet1');
    writeFile(wb, `${this.dateRange.from}-${this.dateRange.to}.xlsx`);
  }
}
