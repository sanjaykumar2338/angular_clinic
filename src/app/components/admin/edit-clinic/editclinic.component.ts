import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Tutorial } from 'src/app/models/tutorial.model';
import { ClinicService } from 'src/app/services/clinic.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-clinic-list',
  templateUrl: './editclinic.component.html',
  styleUrls: ['./editclinic.component.css'],
})
export class EditClinicComponent implements OnInit {
  tutorials?: Tutorial[];
  currentTutorial: Tutorial = {};
  submitted = false;
  form: FormGroup;
  errorMessage: any;
  clinicId: any;
  clinicData: any;
  loading: boolean;
  image_url: string = '';
  isAddingAdmin: boolean = true;
  suggestions: any[] = [];
  selectedDoctor: any = null;
  showSuggestions: boolean = false;
  selectedIndex: number = -1;
  predefinedSuggestions = [];
  selectedDocId: any = '';
  adminForm: any = null;
  @ViewChild('fileInput') fileInput!: ElementRef;
  editedAdminIndex: number = -1;
  constructor(
    private clinicService: ClinicService,
    private fb: FormBuilder,
    private router: Router,
    private aroute: ActivatedRoute,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getClinicById();
    this.getDoctors();
    this.initNewAdminForm();
  }

  buildForm() {
    this.form = this.fb.group({
      clinic_name: ['', [Validators.required]],
      insta_id: ['', Validators.required],
      file: [''],
      picture: [''],
      administrators: this.fb.array([this.initAdmin()]),
      status: [0],
      doctors: this.fb.array([this.initDoctor()]),
    });
  }

  get admins() {
    return this.form.get('administrators') as FormArray;
  }

  get doctors() {
    return this.form.get('doctors') as FormArray;
  }

  initAdmin(admin?: any): FormGroup {
    return this.fb.group({
      clinic_id: [admin?.clinic_id || ''],
      email: [admin?.email || ''],
      id: [admin?.id || ''],
      name: [admin?.name || ''],
      password: [''],
    });
  }

  initDoctor(doctors?: any): FormGroup {
    return this.fb.group({
      clinic_id: [doctors?.clinic_id || ''],
      id: [doctors?.id || ''],
      doctor: [doctors?.doctor || ''],
    });
  }

  addItem(formArray: FormArray, initFunction: () => FormGroup) {
    formArray.push(initFunction());
  }

  removeItem(formArray: FormArray, index: number) {
    formArray.removeAt(index);
  }

  getClinicById() {
    this.aroute.queryParams.subscribe((params: any) => {
      this.clinicId = params?.id;
      this.loading = true;
      this.clinicService.getDataById(this.clinicId).subscribe(
        (clinic: any) => {
          this.clinicData = clinic?.clinic;
          this.form.patchValue(this.clinicData);
          this.loadAdministrators(this.clinicData?.administrators);
          this.loadDoctors(this.clinicData?.doctors);
          this.image_url = clinic?.clinic?.picture;
          this.loading = false;
        },
        (error) => {
          console.error('Algo salió mal');
        }
      );
    });
  }

  onToggleChange(isChecked: boolean) {
    console.log('Toggle button value:', isChecked);
  }

  redirectToPage(route: string) {
    this.router.navigate([route]);
  }

  createAdminFormArray(administrators: any[]): FormArray {
    const adminFormArray = this.fb.array([]) as FormArray;

    for (const adminData of administrators) {
      const adminFormGroup = this.initAdmin(adminData);
      adminFormArray.push(adminFormGroup);
    }

    return adminFormArray;
  }

  loadAdministrators(administrators: any[]) {
    const adminFormArray = this.createAdminFormArray(administrators);
    this.form.setControl('administrators', adminFormArray);
  }

  createDoctorsArray(doctors: any[]): FormArray {
    const doctorsFormArray = this.fb.array([]) as FormArray;

    for (const doctorsData of doctors) {
      const adminFormGroup = this.initDoctor(doctorsData);
      doctorsFormArray.push(adminFormGroup);
    }

    return doctorsFormArray;
  }

  loadDoctors(doctors: any[]) {
    const doctorsFormArray = this.createDoctorsArray(doctors);
    this.form.setControl('doctors', doctorsFormArray);
  }

  updateStatus(form: FormGroup) {
    this.clinicService
      .updateStatus(this.clinicId, form.value.status ? 1 : 0)
      .subscribe(
        (response: any) => {
          this.notificationService.success('Estado actualizado exitosamente');
        },
        (error) => {
          console.error('Algo salió mal');
        }
      );
  }

  addNewDoctor() {
    if (!this.selectedDocId) {
      this.notificationService.warning('Por favor seleccione un doctor');
      return;
    }
  }

  updateClinic() {
    this.form.patchValue({
      picture: this.image_url,
    });
    this.clinicService.updateClinic(this.form.value, this.clinicId).subscribe(
      (response: any) => {
        this.selectedDocId = null;
        this.selectedDoctor = null;
        this.notificationService.success('Clínica actualizada con éxito');
        this.router.navigate(['/superadmin']);
      },
      (error) => {
        console.error('Algo salió mal');
      }
    );
  }

  onSelectionChanges(ev: any) {
    const selectedDoctor = ev[0];
    if (!selectedDoctor) return;
    const doctorsFormArray = this.form.get('doctors') as FormArray;
    doctorsFormArray.push(
      this.initDoctor({
        doctor: selectedDoctor.text,
        clinic_id: this.clinicId,
        id: selectedDoctor.value,
      })
    );
    setTimeout(() => {
      this.selectedDocId = null;
      this.selectedDoctor = null;
    }, 100);
  }

  getDoctors() {
    this.clinicService.getDoctors().subscribe(
      (resp: any) => {
        if (resp?.success === true) {
          this.predefinedSuggestions = resp?.data.map((doctors: any) => {
            console;
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

  removeDoctor(index: number) {
    const doctorsFormArray = this.form.get('doctors') as FormArray;
    doctorsFormArray.removeAt(index);
  }

  checkPasswords() {
    const password = this.adminForm.get('password')?.value;
    const confirmPassword = this.adminForm.get('confirm_password')?.value;
    if (password !== confirmPassword) {
      this.adminForm.get('passwordsMismatch')?.setValue(true);
    } else {
      this.adminForm.get('passwordsMismatch')?.setValue(false);
    }
  }

  removeAdminForm() {
    this.isAddingAdmin = false;
    this.adminForm = new FormGroup({});
  }

  initNewAdminForm() {
    this.adminForm = this.fb.group({
      clinic_id: [this.clinicId || ''],
      email: ['', Validators.required],
      id: [''],
      name: ['', Validators.required],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required],
      passwordsMismatch: [false, Validators.required],
    });
  }

  addNewAdmin() {
    this.isAddingAdmin = true;
    if (this.adminForm.invalid) {
      this.notificationService.warning(
        'Administrador | Por favor llene todos los campos'
      );
    } else {
      if (this.adminForm.value.name) {
        this.admins.push(this.initAdmin(this.adminForm.value));
      }
      this.initNewAdminForm();
    }
  }

  removeAdmin(index: number) {
    const adminFormArray = this.form.get('administrators') as FormArray;
    adminFormArray.removeAt(index);
  }

  openUpload() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('picture', file);
      this.clinicService.uploadImage(formData).subscribe(
        (res: any) => {
          if (res?.success) {
            this.notificationService.success('Imagen cargada exitosamente');
            this.image_url = res?.picture;
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }

  removeUpload() {
    this.image_url = '';
    this.form.patchValue({
      picture: '',
    });
  }

  editAdmin(index: number) {
    this.editedAdminIndex = index;
    this.adminForm.patchValue({
      ...this.admins.value[index],
      confirm_password: '',
    });
  }

  resetEditAdmin() {
    this.editedAdminIndex = -1;
    this.initNewAdminForm();
  }

  updateExistingAdmin() {
    this.admins.controls[this.editedAdminIndex].patchValue(
      this.adminForm.value
    );
    this.resetEditAdmin();
  }

  validateAdminExistence(event: any) {
    if (this.isAddingAdmin === false || !event.target.value) return;
    this.clinicService.validateAdminExist(event.target.value).subscribe(
      (res: any) => {
        if (res?.userexist) {
          event.target.value = '';
          this.notificationService.warning(
            'El administrador ya existe, prueba con otro.'
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
