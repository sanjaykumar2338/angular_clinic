import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash'
import * as moment from 'moment';
import { ExpenseService } from 'src/app/services/expense.service';
import { NotificationService } from 'src/app/services/notification.service';

import {WorkSheet, utils, WorkBook, writeFile} from 'xlsx';

@Component({
  selector: 'expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
})
export class ExpenseComponent implements OnInit {
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
  expenses: any = [];
  moment: any = moment();
  selectedExpense: any = null;
  page: number = 1;
  showLoader: boolean = false;

  constructor(
    private expenseService: ExpenseService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.getExpenses();
  }

  showAside() {
    this.selectedExpense = null;
    this.asideState = {
      hidden: false,
    };
  }

  getExpenses() {
    this.showLoader = true;
    this.expenseService.getExpense(this.dateRange).subscribe((res) => {
      this.expenses = res.expenses;
      this.showLoader = false;
    });
  }

  deleteExpense(id: any) {
    this.notification.confirmDialog().then((result) => {
      if (result.isConfirmed) {
        this.expenseService.deleteExpense(id).subscribe(
          (response: any) => {
            this.notification.success('Eliminado con éxito');
            this.getExpenses();
          },
          (error: any) => {
            this.notification.error('Error al eliminar');
          }
        );
      }
    });
  }

  editExpense(expense: any) {
    this.selectedExpense =  _.cloneDeep(expense);
    this.asideState = {
      hidden: false,
    };
  }

  exportToExcel(): void {
    const sheetToDownload = this.expenses.map((item: any) => {
      return {
        Fecha: moment(item.created_at).format('YYYY-MM-DD'),
        Concepto: item.payment_purpose,
        Categoría: item.category.name,
        Total: item.amount,
        Pagado: item.paid,
        Adeudo: item.to_be_paid,
        Estatus: item.status,
        Metodo: item.payment_method.name,
        Comentarios: item.comments,
        Cantidad: item.quantity,
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
    this.getExpenses();
  }

  trackByFn(index: number): any {
    return index;
  }

  onExpenseSuccess(ev: any) {
    this.getExpenses();
  }
}
