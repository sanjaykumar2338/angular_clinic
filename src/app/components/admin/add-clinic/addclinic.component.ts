import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Tutorial } from 'src/app/models/tutorial.model';
import { ClinicService } from 'src/app/services/clinic.service';
import { NotificationService } from 'src/app/services/notification.service';
import { environment } from 'src/environments/environment';

interface Item {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  passwordsMismatch: boolean;
}

interface Item2 {
  doctor: string;
  id: number | string;
}

@Component({
  selector: 'app-clinic-list',
  templateUrl: './addclinic.component.html',
  styleUrls: ['./addclinic.component.css'],
})
export class AddClinicComponent implements OnInit {
  tutorials?: Tutorial[];
  currentTutorial: Tutorial = {};
  email: string = '';
  password: string = '';
  submitted = false;
  myForm: FormGroup;
  errorMessage: any;
  apiURL = environment.apiUrl;
  selectedFile: File | null = null;
  imageUrl: string | ArrayBuffer | null = null;
  items: Item[] = [
    {
      name: '',
      email: '',
      password: '',
      confirm_password: '',
      passwordsMismatch: false,
    },
  ];
  doctors: any[] = [
    {
      doctor: '',
      id: '',
    },
  ];
  inputText: string = '';
  searchControl = new FormControl();
  docList: any;
  filteredSuggestions: any;
  suggestions: string[] = [];

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private clinicService: ClinicService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getDoctors();
  }

  /**
   * Build form data
   */
  buildForm() {
    this.myForm = this.fb.group({
      clinic_name: ['', [Validators.required]],
      insta_id: ['', Validators.required],
      file: ['', ''],
      picture: ['', ''],
      items: this.fb.array([this.createItem()]),
    });
  }

  createItem(): FormGroup {
    return this.fb.group({
      name: '',
      email: '',
      password: '',
      confirm_password: '',
      passwordsMismatch: false,
    });
  }

  displayFn(value: string): string {
    return value;
  }

  cloneItemAdmin(): void {
    const lastItem = this.items[this.items.length - 1];
    if (lastItem.name === '') {
      this.notify.warning('Por favor ingrese el nombre del administrador');
      return;
    }
    const newItem: Item = {
      name: '',
      email: '',
      password: '',
      confirm_password: '',
      passwordsMismatch: false,
    };
    this.items.push(newItem);
  }

  onInputChange(value: string): void {
    this.inputText = value;
    this.filteredSuggestions = this.filterSuggestions(value);
  }

  filterSuggestions(value: string): string[] {
    return this.suggestions.filter(
      (suggestion: any) =>
        suggestion.user.first_name
          .toLowerCase()
          .includes(value.toLowerCase()) ||
        suggestion.user.last_name.toLowerCase().includes(value.toLowerCase())
    );
  }

  selectSuggestion(suggestion: any, i: any): void {
    this.inputText = suggestion;
    console.log(suggestion);
    this.filteredSuggestions = [];

    let doctor = suggestion.user.first_name + ' ' + suggestion.user.last_name;
    const newItem2: Item2 = { doctor: doctor, id: suggestion.user.id };
    this.doctors.push(newItem2);
  }

  cloneItemDoctor(): void {
    const lastDoctor = this.doctors[this.doctors.length - 1];
    if (lastDoctor.doctor === '') {
      this.notify.warning('Por favor seleccione doctor');
      return;
    }
    const newItem2: Item2 = { doctor: '', id: '' };
    this.doctors.push(newItem2);
  }

  openUpload() {
    this.fileInput.nativeElement.click();
  }

  getDoctors() {
    this.clinicService.getDoctors().subscribe(
      (resp: any) => {
        if (resp?.success === true) {
          this.docList = resp?.data.map((doctors: any) => {
            return {
              id: doctors?.user.id,
              user: doctors,
              text: doctors?.user.first_name + ' ' + doctors?.user.last_name,
            };
          });
          this.suggestions = resp?.data;
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const file = event.target.files[0];
      this.selectedFile = file;
      const formData = new FormData();
      formData.append('picture', file);
      this.clinicService.uploadImage(formData).subscribe(
        (res: any) => {
          if (res?.success) {
            this.notify.success('Imagen cargada exitosamente');
            this.imageUrl = res?.picture;
            this.myForm.patchValue({
              picture: res?.picture,
            });
          }
        },
        (error: any) => {
          console.log(error);
        }
      );

      console.log(this.myForm, 'myForm');

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
        this.cdRef.detectChanges();
        $('.image-upload-wrap').hide();
        $('.file-upload-content').show();
        //event.target.value = null;
      };
      reader.readAsDataURL(file);
    }
  }

  setBlank(event: any) {
    //event.target.value = null;
  }

  removeUpload() {
    this.imageUrl = '';
    this.selectedFile == null;
    $('.file-upload-content').hide();
    $('.image-upload-wrap').show();
  }

  removeItem(index: number): void {
    this.items.splice(index, 1);
  }

  removeDoctors(index: number): void {
    if (this.doctors.length == 1) {
      this.notify.warning('Debería haber al menos un médico allí.');
      return;
    }
    this.doctors.splice(index, 1);
  }

  checkPasswords(index: number) {
    const { password, confirm_password } = this.items[index];
    if (password && confirm_password) {
      this.items[index].passwordsMismatch = password !== confirm_password;
    } else {
      this.items[index].passwordsMismatch = false;
    }
  }

  /**
   * Function to Add Clinic
   * @returns
   */
  onSubmit() {
    this.submitted = true;
    console.log('selected ', this.selectedFile);
    if (this.myForm.invalid || this.selectedFile == null) {
      return;
    } else {
      let action: string = 'clinic/add';
      this.myForm.value.doctors = this.doctors;
      this.myForm.value.administrators = this.items;
      delete this.myForm.value.items;
      const data = this.myForm.value;
      this.clinicService.postData(action, data).subscribe(
        (res: any) => {
          if (res?.success) {
            this.notify.success('Clínica agregada con éxito');
            this.router.navigate(['/superadmin']);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  onSelectionChanges(ev: any, index: number) {
    const data = ev[0];
    this.doctors[index].doctor = data?.text;
  }

  validateAdminExistence(admin: any) {
    if (!admin.email) return;
    this.clinicService.validateAdminExist(admin.email).subscribe(
      (res: any) => {
        if (res?.userexist) {
          admin.email = '';
          this.notify.warning(
            'El administrador ya existe, prueba con otro..'
          );
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  openFileInput() {
    this.fileInput.nativeElement.click();
  }
}
