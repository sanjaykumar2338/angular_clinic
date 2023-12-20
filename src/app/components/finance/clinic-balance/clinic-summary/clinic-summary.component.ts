import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ClinicBalanceService } from 'src/app/services/clinic-balance.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'clinic-summary',
  templateUrl: './clinic-summary.component.html',
  styleUrls: ['./clinic-summary.component.scss'],
})
export class ClinicSummaryComponent implements OnInit {
  public data: any = {
    expenses: 0,
    revenue: 0
  } 
  dateRange: any = {
    startDate: moment().subtract(1, 'year').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
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
    startDate: moment().subtract(1, 'year'),
    endDate: moment(),
  };
  income: any = [];
  expense: any = [];
  public incomeChart: any;
  public expenseChart: any;
  constructor(private clinicBalanceSvc: ClinicBalanceService) {}

  ngOnInit(): void {
    this.getClinicSummary();
  }
  
  getClinicSummary() {
    const range = {
      from: moment(this.dateRange.startDate).format('YYYY-MM-DD'),
      to: moment(this.dateRange.endDate).format('YYYY-MM-DD')
    }
    this.clinicBalanceSvc.getClinicSummary(range).subscribe((res: any) => {
      this.data = res.data.summary;
      this.income = res.data.chart.concept;
      this.expense = res.data.chart.expense;
      this.createIncomeChart();
      this.createExpenseChart();
       })
  }
  selectedDate(value: any) {
    this.getClinicSummary();
  }

  createIncomeChart(): void {
    if (!this.income || this.income.length === 0) {
      return;
    }

    const concepts = this.income.map((item: any) => item.concept);
    const totals = this.income.map((item: any) => item.total);

    const ctx = document.getElementById('incomeChart') as HTMLCanvasElement;
    const backgroundColors = this.generateRandomColors(concepts.length);
    this.incomeChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: concepts,
        datasets: [
          {
            data: totals,
            backgroundColor: backgroundColors
          },
        ],
      },
    });
  }

  createExpenseChart(): void {
    if (!this.expense || this.expense.length === 0) {
      return;
    }

    const category = this.expense.map((item: any) => item.category);
    const totals = this.expense.map((item: any) => item.total);

    const ctx = document.getElementById('expenseChart') as HTMLCanvasElement;
    const backgroundColors = this.generateRandomColors(category.length);
    this.expenseChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: category,
        datasets: [
          {
            data: totals,
            backgroundColor: backgroundColors
          },
        ],
      },
    });
  }

  generateRandomColors(count: number): string[] {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Generate a random hex color
      colors.push(color);
    }
    return colors;
  }
}
