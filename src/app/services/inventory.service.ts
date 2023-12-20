import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  apiUrl: any;
  header: any = new HttpHeaders();

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;

    this.header = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token')
    );
  }

  getMaterialList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/material`, this.header);
  }

  addNewMaterial(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/material`, data, this.header);
  }

  reStock(id: any, data: any): Observable<any> { 
    return this.http.put(`${this.apiUrl}/material/stock/${id}`, data, this.header);
  }

  uploadMaterial(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/material/importmaterial`, data, this.header);
  }
  
  deleteMaterial(id: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/material/${id}`, this.header);
  }


  getGeneralStockList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/general_warehouse`, this.header);
  }

  addNewGeneralStock(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/general_warehouse`, data, this.header);
  }

  generalReStock(id: any, data: any): Observable<any> { 
    return this.http.put(`${this.apiUrl}/general_warehouse/stock/${id}`, data, this.header);
  }

  uploadGeneralStock(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/material/importgeneral`, data, this.header);
  }
  
  deleteGeneralStock(id: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/general_warehouse/${id}`, this.header);
  }


}
