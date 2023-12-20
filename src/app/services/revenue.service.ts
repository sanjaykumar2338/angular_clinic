import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RevenueService {
  apiUrl: any;
  header: any = new HttpHeaders();

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;

    this.header = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token')
    );
  }

  getInventoryItems(): Observable<any> {
    return this.http.get(`${this.apiUrl}/inventory`, this.header);
  }

  getInventoryItemsMedicine(): Observable<any> {
    return this.http.get(`${this.apiUrl}/inventory/list/stock`, this.header);
  }

  createPaymentPurpose(name: string): Observable<any> {
    const data = { name };
    return this.http.post(`${this.apiUrl}/paymentpurpose`, data, this.header);
  }

  getPaymentPurposes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/paymentpurpose`, this.header);
  }

  getPaymentMethod(): Observable<any> {
    return this.http.get(`${this.apiUrl}/paymentmethod`, this.header);
  }

  savePayment(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/revenue`, data, this.header);
  }

  getRevenue(dateRange: any): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/revenue?from=${dateRange.from}&to=${dateRange.to}`,
      this.header
    );
  }

  updatePayment(data: any, id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/revenue/${id}`, data, this.header);
  }

  addNewPayment(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/revenue`, data, this.header);
  }

  getPaymentById(id: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/revenue/${id}`, this.header);
  }

  deletePayment(id: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/revenue/${id}`, this.header);
  }

  getPatients(): Observable<any> {
    return this.http.get(`${this.apiUrl}/clinic/patients/list`, this.header);
  }
  getPatientById(id: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/clinic/patient/${id}`, this.header);
  }
}
