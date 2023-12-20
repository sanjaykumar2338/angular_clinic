import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Tutorial } from 'src/app/models/tutorial.model';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-tutorials-list',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  myForm: FormGroup;
  tutorials?: Tutorial[];
  currentTutorial: Tutorial = {};
  email: string = '';
  password: string = '';
  submitted = false;
  errorMessage: any;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private notify: NotificationService
  ) {
    if (window.innerWidth <= 991) {
      $('body').addClass('full_content');
    }
  }

  ngOnInit() {
    this.buildFormData();
  }

  /**
   * Build Form data
   */
  buildFormData() {
    this.myForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
      password: ['', Validators.required],
    });
  }

  /**
   * Function to Login by email and password
   * @returns
   */
  async onSubmit() {
    this.submitted = true;
    if (this.myForm.invalid) {
      return;
    } else {
      let action: string = 'login';
      await this.authService.postData(action, this.myForm?.value).subscribe(
        (res: any) => {
          if (res?.success == true) {
            localStorage.setItem('token', res?.data?.token);
            localStorage.setItem('user_type', res?.data?.user?.user_type);
            this.authService.setClinicDetail(res?.data?.clinic);
            this.authService.setUserDetail(res?.data?.user);
            this.notify.success('Iniciar sesión exitosamente');
            //setTimeout(() => {
            if (res.data.user.user_type == 'superadmin') {
              this.router.navigate(['/superadmin']);
            } else {
              this.router.navigate(['/schedule-appointment']);
            }
            //}, 100);
          }
        },
        (error) => {
          this.notify.error(error.statusText);
          console.log(error);
        }
      );
    }
  }
}
