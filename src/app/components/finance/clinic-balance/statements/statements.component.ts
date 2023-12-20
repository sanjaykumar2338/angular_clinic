import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ClinicBalanceService } from 'src/app/services/clinic-balance.service';
import {WorkSheet, utils, WorkBook, writeFile} from 'xlsx';



@Component({
  selector: 'clinic-statement',
  templateUrl: './statements.component.html',
  styleUrls: ['./statements.component.css'],
})
export class clinicStatmentComponent implements OnInit {
  public income: any = [];
  public expenses: any = [];
  profitBeforeTaxes: any = [];
  dateRange: any = {
    from: moment().subtract(1, 'year').format('YYYY-MM-DD'),
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
    startDate: moment().subtract(1, 'year'),
    endDate: moment(),
  };
  totalIncomePerMonth: { monthYear: string; total: number }[] = [];
  totalExpensePerMonth: { monthYear: string; total: number }[] = [];
  statementData: any = {};
  constructor(private clinicBalanceSvc: ClinicBalanceService) {}

  ngOnInit(): void {
    this.getStatements();
  }

  getStatements() {
    this.clinicBalanceSvc.getIncomeExpenseStatement(this.dateRange).subscribe((res: any) => {
      this.statementData = res.data;
      this.income = res.data.revenue;
      this.expenses = res.data.expense;
      this.calculateOperatingProfitBeforeTaxes();
      this.calculateTotalIncomePerMonth();
      this.calculateTotalExpensePerMonth();
    })
  }

  calculateOperatingProfitBeforeTaxes() {
    // Initialize a map to store the aggregated data for each month
    const monthlyDataMap = new Map();

    // Iterate through income data
    this.income.forEach((incomeConcept: any) => {
      incomeConcept.months.forEach((incomeMonth: any) => {
        const key = `${incomeMonth.month}-${incomeMonth.year}`;
        if (!monthlyDataMap.has(key)) {
          // If the key doesn't exist, initialize it with income amount
          monthlyDataMap.set(key, { month: incomeMonth.month, year: incomeMonth.year, amount: incomeMonth.amount });
        } else {
          // If the key exists, add the income amount to it
          const existingData = monthlyDataMap.get(key);
          if (existingData) {
            existingData.amount += incomeMonth.amount;
          }
        }
      });
    });

    // Iterate through expense data and subtract expenses from the aggregated data
    this.expenses.forEach((expenseCategory: any) => {
      expenseCategory.months.forEach((expenseMonth: any) => {
        const key = `${expenseMonth.month}-${expenseMonth.year}`;
        if (monthlyDataMap.has(key)) {
          const existingData = monthlyDataMap.get(key);
          if (existingData) {
            existingData.amount -= expenseMonth.amount;
          }
        }
      });
    });


    this.profitBeforeTaxes = Array.from(monthlyDataMap.values());
  }

  selectedDate(value: any) {
    this.dateRange = {
      from: moment(value.start).format('YYYY-MM-DD'),
      to: moment(value.end).format('YYYY-MM-DD'),
    };
    this.getStatements();
  }
  
  calculateTotalIncomePerMonth(): void {
    const tempTotalIncomePerMonth: { [monthYear: string]: number } = {};

    this.income.forEach((concept: any) => {
      concept.months.forEach((data: any) => {
        const monthYear = `${data.month}-${data.year}`;
        if (!tempTotalIncomePerMonth[monthYear]) {
          tempTotalIncomePerMonth[monthYear] = 0;
        }
        tempTotalIncomePerMonth[monthYear] += data.amount;
      });
    });

    this.totalIncomePerMonth = Object.keys(tempTotalIncomePerMonth).map((key) => ({
      monthYear: key,
      total: tempTotalIncomePerMonth[key],
    }));
    const total = this.totalIncomePerMonth.reduce((a: any, b: any) => a + b.total, 0);
    this.totalIncomePerMonth.push({ monthYear: 'Total', total });
  }

  calculateTotalExpensePerMonth(): void {
    const tempTotalExpensePerMonth: { [monthYear: string]: number } = {};

    this.expenses.forEach((category: any) => {
      category.months.forEach((data: any) => {
        const monthYear = `${data.month}-${data.year}`;
        if (!tempTotalExpensePerMonth[monthYear]) {
          tempTotalExpensePerMonth[monthYear] = 0;
        }
        tempTotalExpensePerMonth[monthYear] += data.amount;
      });
    });

    this.totalExpensePerMonth = Object.keys(tempTotalExpensePerMonth).map((key) => ({
      monthYear: key,
      total: tempTotalExpensePerMonth[key],
    }));
    const total = this.totalExpensePerMonth.reduce((a: any, b: any) => a + b.total, 0);
    this.totalExpensePerMonth.push({ monthYear: 'Total', total });
  }

  shortenMonthName(fullMonthName: string): string {
    const monthMappings: { [key: string]: string } = {
      'January': 'Jan',
      'February': 'Feb',
      'March': 'Mar',
      'April': 'Apr',
      'May': 'May',
      'June': 'Jun',
      'July': 'Jul',
      'August': 'Aug',
      'September': 'Sep',
      'October': 'Oct',
      'November': 'Nov',
      'December': 'Dec',
    };
  
    // Check if the provided month name exists in the mappings
    if (monthMappings.hasOwnProperty(fullMonthName)) {
      return monthMappings[fullMonthName];
    } else {
      return fullMonthName; // Return the original month name if not found
    }
  }
  
  exportToExcel(): void {
    const dataToExport = this.statementData;

    const wb: WorkBook = utils.book_new();

    // Function to shorten sheet names to 31 characters or less
    const shortenSheetName = (name: string) => name.substring(0, 31);

    // Create the "Revenue" worksheet
    const revenueData = dataToExport.revenue.map((concept: any) => {
      const rowData: any = {
        Concept: concept.concept,
      };

      concept.months.forEach((month: any) => {
        rowData[`${month.month} ${month.year}`] = month.amount;
      });

      return rowData;
    });

    const revenueWs: WorkSheet = utils.json_to_sheet(revenueData);
    utils.book_append_sheet(wb, revenueWs, 'Revenue');

    // Create the "Expense" worksheet
    const expenseData = dataToExport.expense.map((category: any) => {
      const rowData: any = {
        Category: category.category,
      };

      category.months.forEach((month: any) => {
        rowData[`${month.month} ${month.year}`] = month.amount;
      });

      return rowData;
    });

    const expenseWs: WorkSheet = utils.json_to_sheet(expenseData);
    utils.book_append_sheet(wb, expenseWs, 'Expense');
    writeFile(wb, `${this.dateRange.from}-${this.dateRange.to}.xlsx`);
  }
}
