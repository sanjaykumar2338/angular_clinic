import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import * as moment from 'moment';
import { PatienceBalanceService } from 'src/app/services/patience-balance.service';
import { WorkBook, WorkSheet, utils, writeFile } from 'xlsx';

@Component({
  selector: 'patient-balance',
  templateUrl: './patient-balance.component.html',
  styleUrls: ['./patient-balance.component.scss'],
})
export class PatientBalanceComponent implements OnInit {
    @Input() patientBalance: any[] = [];
    page: number = 1;
    showLoader: boolean = false;
    constructor() {
    }

    ngOnInit(): void {
    }

    ngOnChanges(s: SimpleChanges): void {
      this.showLoader = false;
    }

    exportToExcel(): void {
      const sheetToDownload = this.patientBalance.map((item: any) => {
        return {
          'Paciente': item.patient,
          'Importe total':item.total_amount,
          'Descuentos' :item.discount,
          'Plan de pagos': item.payment_plan,
          'Comisiones': item.commission,
          'Pagado': item.paid,
          'Pendiente': item.pending,
          'Seguro': item.insurance,
          'Aseguradora': item.insurance_company,
          'Fecha de última actualización': moment(item.last_update).format('YYYY-MM-DD'),
        };
      });
      const shortenSheetName = this.patientBalance[0].patient.substring(0, 31);
      const ws: WorkSheet = utils.json_to_sheet(sheetToDownload);
      const wb: WorkBook = utils.book_new();
      utils.book_append_sheet(wb, ws, 'Sheet1');
      writeFile(wb, `${shortenSheetName}.xlsx`);
    }
}