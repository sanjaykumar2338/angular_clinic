import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClinicService } from 'src/app/services/clinic.service';
import { NotificationService } from 'src/app/services/notification.service';
import { RevenueService } from 'src/app/services/revenue.service';

@Component({
  selector: 'revenue-aside-pane',
  templateUrl: './aside-pane.component.html',
  styleUrls: ['./aside-pane.component.css'],
})
export class RevenueAsidePaneComponent implements OnInit, OnChanges {
  @Input() selectedPayment: any = null;
  @Input() asideState: any = {
    hidden: true,
  };
  @Output() onPaymentSuccess: EventEmitter<any> = new EventEmitter();
  paymentForm: any = new FormGroup({}) as any;
  paymentMethods: any[] = [];
  conceptoOptions: any[] = [];
  paymentpurposeOptions: any[] = [];
  inventoryItems: any[] = [];
  patientList: any[] = [];
  doctorList: any[] = [];
  enableInventory: boolean = false;
  constructor(
    private fb: FormBuilder,
    private revenueService: RevenueService,
    private clinicSvc: ClinicService,
    private notification: NotificationService
  ) {
    this.initPaymentForm();
  }

  ngOnInit() {
    this.getInventoryItems();
    this.getPaymentPurposes();
    this.getPaymentMethod();
    this.getPatients();
    this.getDoctorList();
  }

  initPaymentForm() {
    this.paymentForm = this.fb.group({
      patient: ['', Validators.required],
      // patient: this.fb.array([this.newPatientForm()]),
      doctor: ['', Validators.required],
      payment_purpose: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      amount_paid: ['', [Validators.required, Validators.min(0)]],
      payment_method: ['', Validators.required],
      comments: [''],
      quantity: [''],
      inventory_id: [''],
    });
  }

  private newPatientForm() {
    return this.fb.group({
      id: ['', Validators.required],
    });
  }

  addPaymentMethod(option: string) {
    if (!this.paymentMethods.includes(option)) {
      this.paymentMethods.push(option);
    }
  }

  addConceptoOption(option: string) {
    if (!this.conceptoOptions.includes(option)) {
      this.conceptoOptions.push(option);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.selectedPayment) {
      this.paymentForm.patchValue({
        patient: this.selectedPayment.patient.id,
        // patients: this.patchPatientForm(this.selectedPayment.patient),
        doctor: this.selectedPayment.doctor.id,
        payment_purpose: this.selectedPayment.payment_purpose.id,
        price: this.selectedPayment.price,
        amount_paid: this.selectedPayment.amount_paid,
        payment_method: this.selectedPayment.payment_method.id,
        comments: this.selectedPayment.comments,
        inventory:
          (this.selectedPayment.inventory &&
            this.selectedPayment.inventory.id) ||
          '',
        quantity: this.selectedPayment.quantity,
      });
    } else {
      this.initPaymentForm();
    }
  }

  patchPatientForm(patient: any) {
    const control = this.paymentForm.controls['patient'] as FormArray;
    patient.forEach((element: any, index: number) => {
      if (index === 0) {
        control.at(index).patchValue({ id: element.id });
      } else {
        const group = this.newPatientForm();
        group.patchValue({ id: element.id });
        control.push(group);
      }
    });
    return control;
  }

  closeAside() {
    this.selectedPayment = null;
    this.initPaymentForm();
    this.asideState = {
      hidden: true,
    };
  }

  getInventoryItems() {
    this.revenueService.getInventoryItemsMedicine().subscribe((res) => {
      this.inventoryItems = res.data.map((item: any) => {
        return {
          id: item.id,
          text: `${item.name} - ${item.quantity} disponible(s)`,
          qty: item.quantity,
        };
      });
    });
  }

  getPaymentPurposes() {
    this.revenueService.getPaymentPurposes().subscribe((res) => {
      this.paymentpurposeOptions = res.paymentpurpose;
    });
  }

  getPaymentMethod() {
    this.revenueService.getPaymentMethod().subscribe((res) => {
      this.paymentMethods = res.paymentmethod;
    });
  }

  addNewPatient() {
    const control = this.paymentForm.controls['patient'] as FormArray;
    control.push(this.newPatientForm());
  }

  removePatient(index: number) {
    const control = this.paymentForm.controls['patient'] as FormArray;
    control.removeAt(index);
  }

  onSubmit() {
    if (!this.validatePaymentForm()) return;
    if (this.selectedPayment) {
      this.updatePayment();
    } else {
      this.savePayment();
    }
  }

  updatePayment() {
    this.revenueService
      .updatePayment(this.paymentForm.value, this.selectedPayment.id)
      .subscribe(
        (res) => {
          this.notification.success('Pago actualizado exitosamente');
          this.onPaymentSuccess.emit(true);
          this.closeAside();
        },
        (err) => {
          this.notification.error('Algo salió mal');
        }
      );
  }

  savePayment() {
    this.revenueService.savePayment(this.paymentForm.value).subscribe(
      (res) => {
        this.notification.success('Pago guardado exitosamente');
        this.newPatientForm();
        this.onPaymentSuccess.emit(true);
        this.paymentForm.reset();
        this.closeAside();
      },
      (err) => {
        this.notification.error('Algo salió mal');
      }
    );
  }

  getPatients() {
    this.revenueService.getPatients().subscribe((res) => {
      this.patientList = res.patient.map((item: any) => {
        return {
          id: item.id,
          text: `${item.first_name} ${item.last_name}`,
        };
      });
    });
  }

  getDoctorList() {
    this.clinicSvc.getDoctors('doctors/list').subscribe((res) => {
      this.doctorList = res.data.map((item: any) => {
        return {
          id: item.id,
          text: `${item.user.first_name} ${item.user.last_name}`,
        };
      });
    });
  }

  onSelectionChanges(event: any) {
    const selectedInventory = event[0];
    if (!selectedInventory) return;
    this.paymentForm.patchValue({
      quantity: selectedInventory.data.qty,
    });
  }

  onChangePaymentPurpose(event: any) {
    if (
      event?.selectedOptions[0].text.toLocaleLowerCase() ===
        'medicamentos y material de curación' ||
      event?.selectedOptions[0].text.toLocaleLowerCase() === 'otros arículos'
    ) {
      this.enableInventory = true;
    } else {
      this.enableInventory = false;
    }
  }

  validatePaymentForm() {
    this.paymentForm.markAllAsTouched();
    if (this.paymentForm.invalid) {
      this.notification.error('Por favor complete todos los campos requeridos');
      return false;
    }
    if (this.enableInventory) {
      if (this.paymentForm.get('inventory')?.invalid) {
        this.notification.error('Por favor complete todos los campos requeridos');
        return false;
      }
    }
    return true;
  }
}
