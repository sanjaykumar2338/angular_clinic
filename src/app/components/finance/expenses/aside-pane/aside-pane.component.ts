import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpenseService } from 'src/app/services/expense.service';
import { NotificationService } from 'src/app/services/notification.service';
import { RevenueService } from 'src/app/services/revenue.service';

@Component({
  selector: 'expense-aside-pane',
  templateUrl: './aside-pane.component.html',
  styleUrls: ['./aside-pane.component.css'],
})
export class ExpenseAsidePaneComponent implements OnInit, OnChanges {
  @Input() selectedExpense: any = null;
  @Input() asideState: any = {
    hidden: true,
  };
  @Output() onExpenseSuccess: EventEmitter<any> = new EventEmitter();
  expenseForm: any = new FormGroup({}) as any;
  paymentMethods: any[] = [];
  paymentpurposeOptions: any[] = [];
  providers: any[] = [];
  categories: any[] = [];
  patientList: any[] = [];
  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private revenueService: RevenueService,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    this.initExpenseForm();
    this.getProviders();
    this.getExpenseCategory();
    this.getPaymentMethod();
    this.getPatients();
  }

  initExpenseForm() {
    this.expenseForm = this.fb.group({
      patient: [''],
      paid: ['', Validators.required],
      category: ['', Validators.required],
      cost: ['', Validators.required],
      payment_method: ['', Validators.required],
      comments: [''],
      to_be_paid: ['', Validators.required],
      // status: ['', Validators.required],
      quantity: ['', Validators.required],
      provider: ['', Validators.required],
      amount: ['', Validators.required],
      payment_purpose: ['', Validators.required],
    });
  }

  private newPatientForm() {
    return this.fb.group({
      id: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.selectedExpense) {
      this.expenseForm.patchValue({
        patient: this.selectedExpense.patient.id,
        paid: this.selectedExpense.paid,
        category: this.selectedExpense.category.id,
        cost: this.selectedExpense.cost,
        payment_method: this.selectedExpense.payment_method.id,
        comments: this.selectedExpense.comments,
        to_be_paid: this.selectedExpense.paid,
        // status: this.selectedExpense.status,
        quantity: this.selectedExpense.quantity,
        provider: this.selectedExpense.provider.id,
        amount: this.selectedExpense.amount,
        payment_purpose: this.selectedExpense.payment_purpose,
      });
    } else {
      this.initExpenseForm();
    }
  }

  closeAside() {
    this.selectedExpense = null;
    this.initExpenseForm();
    this.asideState = {
      hidden: true,
    };
  }

  getExpenseCategory() {
    this.expenseService.getExpenseCategory().subscribe((res) => {
      this.categories = res.paymentpurpose;
    });
  }


  getPaymentMethod() {
    this.revenueService.getPaymentMethod().subscribe((res) => {
      this.paymentMethods = res.paymentmethod;
    });
  }

  onSubmit() {
    if (!this.validateexpenseForm()) return;
    if (this.selectedExpense) {
      this.updateExpense();
    } else {
      this.saveExpense();
    }
  }

  updateExpense() {
    this.expenseService
      .updateExpense(this.expenseForm.value, this.selectedExpense.id)
      .subscribe(
        (res) => {
          this.notification.success('Gasto actualizado exitosamente');
          this.onExpenseSuccess.emit(true);
          this.closeAside();
        },
        (err) => {
          this.notification.error('Algo salió mal');
        }
      );
  }

  saveExpense() {
    this.expenseService.saveExpense(this.expenseForm.value).subscribe(
      (res) => {
        this.notification.success('Gasto guardado exitosamente');
        this.newPatientForm();
        this.onExpenseSuccess.emit(true);
        this.expenseForm.reset();
        this.closeAside();
      },
      (err) => {
        this.notification.error('Algo salió mal');
      }
    );
  }

  validateexpenseForm() {
    this.expenseForm.markAllAsTouched();
    if (this.expenseForm.invalid) {
      this.notification.error('Por favor complete todos los campos requeridos');
      return false;
    }
    return true;
  }

  registerRecord() {
    const total =
      Number(this.expenseForm.value.cost) *
      Number(this.expenseForm.value.quantity);
    this.expenseForm.patchValue({
      to_be_paid: total,
      paid: total,
    });
  }

  onValueChanges(event: any) {
    const total =
      Number(this.expenseForm.value.cost) *
      Number(this.expenseForm.value.quantity);
    this.expenseForm.patchValue({
      amount: total,
    });
  }

  getProviders() {
    this.expenseService.getProviders().subscribe((res) => {
      this.providers = res.provider.map((item: any) => {
        return {
          id: item.id,
          text: item.name,
        };
      });
    });
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
}
