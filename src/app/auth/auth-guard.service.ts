import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  constructor(public auth: AuthService, public router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }

  isSuperAdmin(): boolean {
    const token = localStorage.getItem('token');
    const user_type = localStorage.getItem('user_type');

    if (token && user_type == 'superadmin') {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }

  isAdmin(): boolean {
    const token = localStorage.getItem('token');
    const user_type = localStorage.getItem('user_type');

    if (token && user_type == 'admin') {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }

  isNurse(): boolean {
    const token = localStorage.getItem('token');
    const user_type = localStorage.getItem('user_type');

    if (token && user_type == 'nurse') {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
