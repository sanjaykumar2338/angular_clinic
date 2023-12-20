import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Tutorial } from 'src/app/models/tutorial.model';
import { ClinicService } from 'src/app/services/clinic.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-clinic-list',
  templateUrl: './clinic.component.html',
  styleUrls: ['./clinic.component.css'],
})
export class ClinicComponent implements OnInit {
  tutorials?: Tutorial[];
  currentTutorial: Tutorial = {};
  email: string = '';
  password: string = '';
  submitted = false;
  myForm: FormGroup;
  errorMessage: any;
  apiURL = environment.apiUrl;
  clinics: any;
  image_url: any;
  p: number = 1;
  loading: boolean;
  searchText: any;
  selectedSortOption = 'name';
  sortBy = 'clinic_name';

  data: any[] = [];
  page = 1;
  pageSize = 4; // Set your desired page size here
  totalItems = 0;

  constructor(
    private clinicService: ClinicService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.myForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loading = true;
    // this.loadData(this.page);
    this.getClinicList();
  }

  async getClinicList() {
    let action: string = 'list';
    await this.clinicService.getData(action).subscribe(
      (list: any) => {
        if (list?.success === true) {
          this.clinics = list?.clinic;
          this.image_url = list?.path;
          this.loading = false;
        }
      },
      (error) => {
        console.log(error);
        this.loading = false;
      }
    );
  }

  searchData(event: any) {
    this.searchText = (event.target as HTMLInputElement).value;
    this.filteredData();
  }

  onSortChange(event: Event) {
    const selectedSortBy = (event.target as HTMLSelectElement).value;
    this.sortBy = selectedSortBy;
    this.sortData();
  }

  sortData(): void {
    const data = this.clinics;
    if (this.sortBy === 'asc') {
      this.clinics = data
        .slice()
        .sort((a: any, b: any) => a.clinic_name.localeCompare(b.clinic_name));
    } else if (this.sortBy === 'desc') {
      this.clinics = data
        .slice()
        .sort((a: any, b: any) => b.clinic_name.localeCompare(a.clinic_name));
    }
    this.filteredData();
  }

  filteredData(): any[] {
    if (!this.searchText) {
      return this.clinics;
    }

    const lowerSearchText = this.searchText.toLowerCase();
    return this.clinics.filter((item: any) =>
      Object.values(item).some((value: any) =>
        value?.toString().toLowerCase().includes(lowerSearchText)
      )
    );
  }

  redirectToPage(route: string, data?: any) {
    console.log(data, route);
    this.router.navigate([route], {
      queryParams: { id: data?.id },
    });
  }
}
