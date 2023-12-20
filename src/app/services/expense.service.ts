import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  apiUrl: any;
  header: any = new HttpHeaders();

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;

    this.header = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token')
    );
  }

  getExpenseCategory(): Observable<any> {
    return this.http.get(`${this.apiUrl}/expensescategory`, this.header);
  }

  saveExpense(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/expenses`, data, this.header);
  }

  getExpense(dateRange: any): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/expenses?from=${dateRange.from}&to=${dateRange.to}`,
      this.header
    );
  }

  updateExpense(data: any, id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/expenses/${id}`, data, this.header);
  }

  getExpenseById(id: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/expenses/${id}`, this.header);
  }

  deleteExpense(id: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/expenses/${id}`, this.header);
  }

  getProviders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/provider`, this.header);
  }
}
