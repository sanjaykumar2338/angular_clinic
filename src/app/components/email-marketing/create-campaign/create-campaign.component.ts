import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import * as moment from "moment";
import { of } from "rxjs";
import { EmailService } from "src/app/services/email-marketing.service";
import { NotificationService } from "src/app/services/notification.service";

@Component({
  selector: 'create-campaign',
  templateUrl: './create-campaign.component.html',
  styleUrls: ['./create-campaign.component.scss']
})

export class CreateCampaignComponent {
  campaignForm: any = new FormGroup({});
  datePickerOptions: any = {
    singleDatePicker: true,
    showDropdowns: true,
    minYear: 1901,
    autoApply: true,
    locale: { format: 'YYYY-MM-DD',
    daysOfWeek: [
      "Do",
      "Lu",
      "Ma",
      "Mi",
      "Ju",
      "Vi",
      "Sa"
    ], 
    monthNames: [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "Mayo",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic"
    ] },
  };
  filters: any = null;
  constructor(private fb: FormBuilder, private emailService: EmailService,
    private notification: NotificationService, 
    private router: Router) { }
  ngOnInit(): void {
    this.initCampaignForm();
    this.emailService.campaignCriteria.subscribe((res) => {
      this.filters = res;
    });
  }

  initCampaignForm() {
    this.campaignForm = this.fb.group({
      name: ['', Validators.required],
      subject: ['', Validators.required],
      date: [moment().format('YYYY-MM-DD'), Validators.required],
      schedule: ['', Validators.required],
      message: ['', Validators.required],
      header_image: [''],
      main_image: [''],
      final_image: [''],
      header_image_url: [''],
      main_image_url: [''],
      final_image_url: [''],
    });
  }

  onHeaderImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.campaignForm.patchValue({
          header_image: reader.result,
        });
      };
      reader.readAsDataURL(file);
      file.value = '';
    }
  }

  onMainImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.campaignForm.patchValue({
          main_image: reader.result,
        });
      };
      reader.readAsDataURL(file);
      file.value = '';
    }
  }

  onFinalImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.campaignForm.patchValue({
          final_image: reader.result,
        });
      };
      reader.readAsDataURL(file);
      file.value = '';
    }
  }

  get campaignFormControl() {
    return this.campaignForm.controls;
  }

  sendTest() {
    console.log(this.campaignForm.value);
  }

  send() {
    console.log(this.campaignForm.value);
    const dataToSend = {
      ...this.campaignForm.value,
      filters: this.filters,
    };
    this.emailService.sendCampaign(dataToSend).subscribe((res) => {
      this.notification.success('Campaña enviada con éxito');
      this.initCampaignForm();
      this.emailService.campaignCriteria = of(null);
      this.router.navigate(['/email-marketing']);
    }, (err) => {
      this.notification.error('Error al enviar la campaña');
    });
  }

  onSelectDate(event: any) {
    this.campaignForm.patchValue({
      date: event.start.format('YYYY-MM-DD'),
    });
  }
}