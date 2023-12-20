import {
  NgSignaturePadOptions,
  SignaturePadComponent,
} from '@almothafar/angular-signature-pad';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification.service';
import { NursingService } from 'src/app/services/nursing.service';

@Component({
  selector: 'add-nursing',
  templateUrl: './aside-pane.component.html',
  styleUrls: ['./aside-pane.component.css'],
})
export class AddNursingComponent implements OnInit, OnChanges {
  @Input() selectedNurse: any = null;
  @Input() image_path: any = null;
  @Input() asideState: any = {
    hidden: true,
  };
  @Output() onSuccess: EventEmitter<any> = new EventEmitter();
  nursingForm: any = new FormGroup({}) as any;
  @ViewChild('signature') public signaturePad: SignaturePadComponent;
  public signaturePadOptions: NgSignaturePadOptions = {
    // passed through to szimek/signature_pad constructor
    minWidth: 5,
    canvasWidth: 500,
    canvasHeight: 200,
  };
  backIdImage: any = null;
  frontIdImage: any = null;
  @ViewChild ('backId') backId: any = null;
  @ViewChild ('frontId') frontId: any = null;
  permissions = [
    {
      name: 'Acceder a enfermería',
      accessTo: 'nursing',
      value: 1,
      checked: false,
    },
    {
      name: 'Acceder a agenda de consultas',
      accessTo: 'appointment',
      value: 2,
      checked: false,
    },
    {
      name: 'Access to finance',
      value: 3,
      checked: false,
      accessTo: 'finance',
    },
    {
      name: 'Access to inventory',
      value: 4,
      checked: false,
      accessTo: 'inventory',
    },
    {
      name: 'Access to configuration',
      value: 5,
      checked: false,
      accessTo: 'configuration',
    },
  ];
  constructor(
    private fb: FormBuilder,
    private nursingService: NursingService,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    this.initNurseForm();
  }

  initNurseForm() {
    this.nursingForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      license_number: ['', Validators.required],
      academic_degree: ['', Validators.required],
      password: ['', Validators.required],
      // permissions: this.fb.array([]),
      signature: ['', Validators.required],
      officialId_front: ['', Validators.required],
      officialId_back: ['', Validators.required],
    });
  }

  createPermissionFormGroup() {
    return this.fb.group({
      name: [''],
      value: [''],
      checked: [''],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.selectedNurse) {
      this.nursingForm.get('signature').clearValidators();
      this.nursingForm.get('officialId_front').clearValidators();
      this.nursingForm.get('officialId_back').clearValidators();
      this.nursingForm.get('password').clearValidators();
      this.nursingForm.patchValue({
        name: this.selectedNurse.name,
        email: this.selectedNurse.email,
        license_number: this.selectedNurse.license_number,
        academic_degree: this.selectedNurse.academic_degree,
        password: '',
        signature: '',
        officialId_front: '',
        officialId_back: '',
      });
      this.nursingForm.get('email').disable();
      // this.selectedNurse.permissions.forEach((permission: any, index: any) => {
      //   this.togglePermission(
      //     { target: { checked: permission.checked } },
      //     index
      //   );
      // });
      
      this.frontIdImage = `${this.image_path}${this.selectedNurse.officialId_front}`;
      this.backIdImage = `${this.image_path}${this.selectedNurse.officialId_back}`;
      
    } else {
      this.initNurseForm();
    }
  }

  closeAside() {
    this.signaturePad.clear();
    // this.permissions.forEach((permission: any, index: any) => {
    //   permission.checked = false;
    // });
    this.backIdImage = null;
    this.frontIdImage = null;
    this.backId.nativeElement.value = '';
    this.frontId.nativeElement.value = '';
    this.selectedNurse = null;
    this.initNurseForm();
    this.asideState = {
      hidden: true,
    };
  }

  onSubmit() {
    this.nursingForm.get('email').enable();
    if (!this.validateNurseForm()) return;
    // this.selectAtLeastOnePermission();
    if (this.selectedNurse) {
      this.nursingService.updateNurse(this.nursingForm.value, this.selectedNurse.id).subscribe((res) => {
        this.notification.success('Enfermero actualizado correctamente');
        this.closeAside();
        this.onSuccess.emit();
        this.nursingForm.get('email').enable();
      }, (err) => {
        this.notification.error('Algo salió mal');
        this.nursingForm.get('email').disable();
      });
    } else {
      this.nursingService.addNurse(this.nursingForm.value).subscribe((res) => {
        this.notification.success('Enfermero agregado correctamente');
        this.closeAside();
        this.onSuccess.emit();
      }, (err) => { 
        this.notification.error('Algo salió mal');
      });
    }
  }


  validateNurseForm() {
    this.nursingForm.markAllAsTouched();
    if (this.nursingForm.invalid) {
      this.notification.error('Por favor complete todos los campos requeridos');
      return false;
    }
    return true;
  }

  drawComplete(event: MouseEvent | Touch) {
    this.nursingForm.get('signature').setValue(this.signaturePad.toDataURL());
  }

  uploadFrontId(event: any) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.frontIdImage = reader.result;
      this.nursingForm.get('officialId_front').setValue(reader.result);
    };
  }

  uploadBackId(event: any) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.backIdImage = reader.result;
      this.nursingForm.get('officialId_back').setValue(reader.result);
    };
  }

  removeUpload(type: string) {
    if (type === 'frontId') {
      this.frontIdImage = null;
      this.frontId.nativeElement.value = '';
      this.nursingForm.get('officialId_front').setValue('');
    } else {
      this.backIdImage = null;
      this.backId.nativeElement.value = '';
      this.nursingForm.get('officialId_back').setValue('');
    }
  }

  // togglePermission(event: any, index: any) {
  //   const permission = this.permissions[index];
  //   permission.checked = event.target.checked;
  //   this.permissions[index] = permission;
  //   const permissions = this.nursingForm.get('permissions') as FormArray;
  //   if (event.target.checked) {
  //     const permissionFormGroup: any = this.createPermissionFormGroup();
  //     permissionFormGroup.patchValue(permission);
  //     permissions.push(permissionFormGroup);
  //   } else {
  //     permissions.removeAt(index);
  //   }
  // }

  // selectAtLeastOnePermission() {
  //   const permissions = this.nursingForm.get('permissions') as FormArray;
  //   if (permissions.length === 0) {
  //     this.notification.error('Por favor seleccione al menos un permiso');
  //   }
  // }
}
