import { Component, OnInit, ElementRef, Renderer2  } from '@angular/core';
import { Tutorial } from 'src/app/models/tutorial.model';
import { TutorialService } from 'src/app/services/tutorial.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import axios from 'axios';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tutorials-list',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  tutorials?: Tutorial[];
  currentTutorial: Tutorial = {};
  email: string = '';
  password: string = '';
  submitted = false;
  myForm: FormGroup;
  errorMessage:any;
  apiURL = environment.apiUrl;
  
  constructor(
        private tutorialService: TutorialService,
        private fb: FormBuilder,
        private http: HttpClient,
        private el: ElementRef, 
        private renderer: Renderer2,
        private router: Router
    ) { 
    this.myForm = this.fb.group({      
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    
  }

  onSubmit(): void {
    if (this.myForm.valid) {
      // Perform actions when the form is valid
      console.log('Form submitted successfully!');
      const form_data = {
        email: this.myForm.get('email')?.value,
        password: this.myForm.get('password')?.value
      };

      let url = this.apiURL+'login';
      axios.post(url, form_data)
      .then(response => {
          this.errorMessage = '';
          console.log('Response:', response.data);        
          if(response.data.success){            
            localStorage.setItem('userData', JSON.stringify(response.data));
            this.router.navigate(['/dashboard']);
          }else{
            this.errorMessage = response.data.message;
          }
      })
      .catch(error => {
        this.errorMessage = error.response.data.message;        
      });
    } else {
      // Handle the case when the form has validation errors
      console.log('Form has validation errors. Cannot submit.');
    }
  }
}