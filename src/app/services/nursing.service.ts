import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NursingService {
  apiUrl: any;
  header: any = new HttpHeaders();

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;

    this.header = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token')
    );
  }

  addNurse(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/nurse`, data, this.header);
  }

  getNurse(): Observable<any> {
    return this.http.get(`${this.apiUrl}/nurse`, this.header);
  }

  updateNurse(data: any, nurseId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/nurse/${nurseId}`, data, this.header);
  }

  getFileById(patientId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/patientfile/doctor/patient/${patientId}`, this.header);
  }
  getAllFile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/patientfile/doctor/patient/list`, this.header);
  }

  savePatientFile(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/patientfile/save`, data, this.header);
  }

  getNursingSheets(): Observable<any> {
    return this.http.get(`${this.apiUrl}/patientfile/getnursingsheet`, this.header);
  }

  getKardexSheetById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/kardex/${id}`, this.header);
  }

  saveKardexSheet(data: any, id: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/kardex/save/${id}`, data, this.header);
  }

  getKardexSheet(): Observable<any> {
    return this.http.get(`${this.apiUrl}/kardex/nursingsheet/list/all`, this.header);
  }

}
