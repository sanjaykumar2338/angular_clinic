import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { NotificationService } from "src/app/services/notification.service";
import { PatienceBalanceService } from "src/app/services/patience-balance.service";


@Component({
    selector: 'patient-facturation',
    templateUrl: './patient-facturation.component.html',
    styleUrls: ['./patient-facturation.component.scss'],
  })
  
export class FacturationComponent implements OnInit {
  public billingForm: any = new FormGroup({});
  public billingList: any = [];
  showLoader: boolean = false;
  page = 1;
  patientId: any = null;
    constructor(private fb: FormBuilder, 
      private patienceBalanceService: PatienceBalanceService,
      private notificationService: NotificationService,
      private route: ActivatedRoute) {
    }

    ngOnInit(): void {
      this.initBillingForm();
      this.route.params.subscribe((params) => {
        this.patientId = params['id'];
        this.showLoader = true;
        this.getBillingList();
      });
    }

    initBillingForm() {
      this.billingForm = this.fb.group({
        name: ['', Validators.required],
        rfc: ['', Validators.required],
        use_of_invoice: ['', Validators.required], 
        fiscal_regime: ['', Validators.required], 
        email: ['', [Validators.required, Validators.email]],
        email_2: ['', [Validators.required, Validators.email]],
        email_3: ['', [Validators.required, Validators.email]],
        postal_code: ['', Validators.required]
      });
    }

    onSubmit() {
      if (this.billingForm.invalid) {
        this.billingForm.markAllAsTouched();
        return;
      } else {
        this.patienceBalanceService.addBilling(this.billingForm.value).subscribe((res: any) => {
          this.notificationService.success('Facturación agregada correctamente');
          this.billingForm.reset();
          this.getBillingList();
        }, (error: any) => {
          this.notificationService.error('Error al agregar la facturación');
        });
      }
    }

    getBillingList() {
      this.patienceBalanceService.getBillingList(this.patientId).subscribe((res: any) => {
        this.billingList = res.data;
        this.showLoader = false;
      }, (error: any) => {
        this.showLoader = false;
        console.log('Error al obtener la lista');
      });
    }
}