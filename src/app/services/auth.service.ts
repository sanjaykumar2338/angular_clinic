import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url: any;
  userDetail: any = null;
  clinicDetail: any = null;
  constructor(private http: HttpClient) {
    this.url = environment.apiUrl;
   }

  getData(action?: string, data?: any): Observable<any> {
    return this.http
      .get(`${this.url}/${action}`);
  }

  public getDataById(action?: string, id?: any) {
    return this.http.get(`${this.url}/${action}/${id}`);
  }

  public postData(action?: any, data?: any) {
    return this.http.post<any>(`${this.url}/${action}`, data);
  }

  getUserDetail() {
    const user: any = localStorage.getItem('userDetail');
    return JSON.parse(user);
  }

  setClinicDetail(clinicDetail: any) {
    localStorage.setItem('clinicDetail', JSON.stringify(clinicDetail));
  }

  getClinicDetail() {
    const clinicDetail: any = localStorage.getItem('clinicDetail');
    return JSON.parse(clinicDetail);
  }

  setUserDetail(userDetail: any) {
    localStorage.setItem('userDetail', JSON.stringify(userDetail));
  }
  
}
