import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClinicBalanceService {
  apiUrl: any;
  header: any = new HttpHeaders();

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;

    this.header = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token')
    );
  }

  getClinicSummary(dateRange: any) {
    return this.http.get(`${this.apiUrl}/clinicbalance/summary?from=${dateRange.from}&to=${dateRange.to}`, this.header);
  }

  getIncomeExpenseStatement(dateRange: any) {
    return this.http.get(`${this.apiUrl}/clinicbalance/income_expenses_statement?from=${dateRange.from}&to=${dateRange.to}`, this.header);
  }
  
  getClinicTxns(dateRange: any) {
    return this.http.get(`${this.apiUrl}/clinicbalance/all_transcations?from=${dateRange.from}&to=${dateRange.to}`, this.header)
  }
}