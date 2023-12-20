import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  apiUrl: any;
  header: any = new HttpHeaders();

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;

    this.header = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token')
    );
  }

  getAppointmentList(selectedDate: any): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/appointment?date=${selectedDate}`,
      this.header
    );
  }

  addAppointment(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/appointment`, data, this.header);
  }
}
