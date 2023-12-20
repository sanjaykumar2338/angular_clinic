import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  apiUrl: any;
  header: any = new HttpHeaders();

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;

    this.header = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token')
    );
  }

  getRooms(): Observable<any> {
    return this.http.get(`${this.apiUrl}/room`, this.header);
  }

  addRoom(roomName: string): Observable<any> {
    const data = { name: roomName };
    return this.http.post(`${this.apiUrl}/room`, data, this.header);
  }

  deleteRoom(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/room/${id}`, this.header);
  }

  addDoctorAvailability(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/room_slots`, data, this.header);
  }

  getDoctorAvailability(dateRange: any, docId: any): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/room_slots?from=${dateRange.from}&to=${dateRange.to}&doctor=${docId}`,
      this.header
    );
  }

  deleteDoctorAvailability(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/room_slots/${id}`, this.header);
  }

  deleteTimeSlot(
    id: string,
    day: string,
    startTime: string,
    endTime: string
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/room_slots/delete/time?id=${id}&day=${day}&starttime=${startTime}&endtime=${endTime}`,
      this.header
    );
  }

  getServiceByDoctor(id: any): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/appointment/doctor/services/${id}`,
      this.header
    );
  }
}
