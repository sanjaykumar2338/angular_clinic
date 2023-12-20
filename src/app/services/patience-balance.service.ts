import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PatienceBalanceService {
  apiUrl: any;
  header: any = new HttpHeaders();

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;

    this.header = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token')
    );
  }

  getPatientList() {
    return this.http.get(`${this.apiUrl}/patientbalance`, this.header);
  }

  getPatientBalance(id: number) {
    return this.http.get(`${this.apiUrl}/patientbalance/balance/${id}`, this.header);
  }

  getPatientTxns(id: number) {
    return this.http.get(`${this.apiUrl}/patientbalance/movements/${id}`, this.header);
  }

  getDocument(id: number) {
    return this.http.get(`${this.apiUrl}/patientbalance/documentlist/${id}`, this.header);
  }

  saveDocument(id: any, formData: any) {
    return this.http.post(`${this.apiUrl}/patientbalance/document/${id}`, formData, this.header);
  }

  deleteDocument(id: any) {
    return this.http.get(`${this.apiUrl}/patientbalance/document/remove/${id}`, this.header);
  }
  

  downloadDocument(id: any) {
    return  this.http.get(`${this.apiUrl}/patientbalance/document/download/${id}`, { responseType: 'blob' });  
  }

  addBilling(data: any){
    return this.http.post(`${this.apiUrl}/billing_details`, data, this.header);
  }

  getBillingList(id: any) {
    return this.http.get(`${this.apiUrl}/patientbalance/facturacion/${id}`, this.header);
  }
}