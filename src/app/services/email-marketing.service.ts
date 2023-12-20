import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  apiUrl: any;
  header: any = new HttpHeaders();
  campaignCriteria: Observable<any> = new Observable<any>();

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;

    this.header = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token')
    );
  }

  sendCampaign(data: any): Observable<any> {
    return this.http.post(this.apiUrl + '/campaign', data, {
      headers: this.header,
    });
  }

  getCampaigns(): Observable<any> {
    return this.http.get(this.apiUrl + '/campaign/statistics/list', {
      headers: this.header,
    });
  }

  updateCampaign(data: any): Observable<any> {
    return this.http.put(this.apiUrl + '/campaign', data, {
      headers: this.header,
    });
  }

  deleteCampaign(id: any): Observable<any> {
    return this.http.delete(this.apiUrl + '/campaign/' + id, {
      headers: this.header,
    });
  }

  getSpecialtyList(): Observable<any> {
    return this.http.get(this.apiUrl + '/campaign/specialty/list', {
      headers: this.header,
    });
  }

  getSpecialistList(id: any): Observable<any> {
    return this.http.get(this.apiUrl + '/campaign/specialist/list/' + id, {
      headers: this.header,
    });
  }

  getServiceList(id: any): Observable<any> {
    return this.http.get(this.apiUrl + '/campaign/services/list/' + id, {
      headers: this.header,
    });
  }

  filterPatient(data: any): Observable<any> {
    return this.http.post(this.apiUrl + '/campaign/patients/list', data, {
      headers: this.header,
    });
  } 
}
