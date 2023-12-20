import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash'
import * as moment from 'moment';
import { NotificationService } from 'src/app/services/notification.service';
import { RevenueService } from 'src/app/services/revenue.service';
import {WorkSheet, utils, WorkBook, writeFile} from 'xlsx';

@Component({
  selector: 'revenue',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.scss'],
})
export class RevenueComponent implements OnInit {
  dateRange: any = {
    from: moment(new Date()).format('YYYY-MM-DD'),
    to: moment(new Date()).format('YYYY-MM-DD'),
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
  };
  asideState: any = {
    hidden: true,
  };
  revenue: any = [];
  moment: any = moment();
  selectedPayment: any = null;
  page: number = 1;
  showLoader: boolean = false;
  constructor(
    private revenueSvc: RevenueService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.getRevenues();
  }

  showAside() {
    this.selectedPayment = null;
    this.asideState = {
      hidden: false,
    };
  }

  getRevenues() {
    this.showLoader = true;
    this.revenueSvc.getRevenue(this.dateRange).subscribe((res) => {
      this.revenue = res.revenue;
      this.showLoader = false;
    });
  }

  deletePayment(id: any) {
    this.notification.confirmDialog().then((result) => {
      if (result.isConfirmed) {
        this.revenueSvc.deletePayment(id).subscribe(
          (res) => {
            this.notification.success('Pago eliminado correctamente');
            this.getRevenues();
          },
          (error) => {
            this.notification.error('Algo salió mal');
          }
        );
      }
    });
  }

  editPayment(payment: any) {
    this.selectedPayment = _.cloneDeep(payment);
    this.asideState = {
      hidden: false,
    };
  }

  exportToExcel(): void {
    const sheetToDownload = this.revenue.map((item: any) => {
      return {
        Fecha: moment(item.created_at).format('YYYY-MM-DD'),
        Paciente: item.patient.name,
        Doctor: item.doctor.name,
        Concepto: item.payment_purpose.name,
        Precio: item.price,
        Pagado: item.amount_paid,
        Metodo: item.payment_method.name,
        Comentarios: item.comments,
      };
    });
    const ws: WorkSheet = utils.json_to_sheet(sheetToDownload);
    const wb: WorkBook = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Sheet1');
    writeFile(wb, `${this.dateRange.from}-${this.dateRange.to}.xlsx`);
  }

  selectedDate(value: any) {
    this.dateRange = {
      from: moment(value.start).format('YYYY-MM-DD'),
      to: moment(value.end).format('YYYY-MM-DD'),
    };
    this.getRevenues();
  }

  trackByFn(index: number): any {
    return index;
  }

  onPaymentSuccess(ev: any) {
    this.getRevenues();
  }
}
