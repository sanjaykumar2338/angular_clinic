import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClinicService {
  url: any;

  constructor(private http: HttpClient) {
    this.url = environment.apiUrl;
  }

  getData(action?: string, data?: any): Observable<any> {
    return this.http.get(`${this.url}/clinic/${action}`);
  }

  getDoctors(action?: string): Observable<any> {
    return this.http.get(`${this.url}/clinic/doctors/list`);
  }

  getDataById(id?: number) {
    var header = {
      headers: new HttpHeaders().set(
        'Authorization',
        'Bearer ' + localStorage.getItem('token')
      ),
    };
    return this.http.get(`${this.url}/clinic/index/${id}`, header);
  }

  postData(action?: any, data?: any) {
    //     console.log(action, data)
    //     // Display the key/value pairs
    // for (var pair of data.entries()) {
    //   console.log(pair[0]+ ', ' + pair[1]);
    // }

    var header = {
      headers: new HttpHeaders().set(
        'Authorization',
        'Bearer ' + localStorage.getItem('token')
      ),
    };
    return this.http.post<any>(`${this.url}/${action}`, data, header);
  }

  updateStatus(id?: number, status?: number) {
    var header = {
      headers: new HttpHeaders().set(
        'Authorization',
        'Bearer ' + localStorage.getItem('token')
      ),
    };
    return this.http.post(`${this.url}/clinic/status`, { id, status }, header);
  }

  updateClinic(data?: any, id?: number) {
    var header = {
      headers: new HttpHeaders().set(
        'Authorization',
        'Bearer ' + localStorage.getItem('token')
      ),
    };
    return this.http.post(`${this.url}/clinic/update/${id}`, data, header);
  }

  uploadImage(data?: any) {
    var header = {
      headers: new HttpHeaders().set(
        'Authorization',
        'Bearer ' + localStorage.getItem('token')
      ),
    };
    return this.http.post(`${this.url}/clinic/upload_picture`, data, header);
  }

  validateAdminExist(emailId: any) {
    var header = {
      headers: new HttpHeaders().set(
        'Authorization',
        'Bearer ' + localStorage.getItem('token')
      ),
    };
    return this.http.get(
      `${this.url}/clinic/userexist?email=${emailId}`,
      header
    );
  }
}
