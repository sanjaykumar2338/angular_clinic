import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { ClinicService } from "src/app/services/clinic.service";
import { EmailService } from "src/app/services/email-marketing.service";
import { NotificationService } from "src/app/services/notification.service";

@Component({
    selector: 'email-recipient',
    templateUrl: './email-recipient.component.html',
    styleUrls: ['./email-recipient.component.scss']
})

export class EmailRecipientComponent {
    specialtyList: any[] = [];
    specialistList: any[] = [];
    serviceList: any[] = [];
    selectedSpecialty: any = null;
    patienceCriteria: any = null;
    datePickerOptions: any = {
        singleDatePicker: true,
        showDropdowns: true,
        minYear: 1901,
        autoApply: false,
        locale: {
            format: 'YYYY-MM-DD',
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
            ],
        },
        autoUpdateInput: false,
    };

    datePickerOptions1: any = {
        singleDatePicker: true,
        showDropdowns: true,
        minYear: 1901,
        autoApply: false,
        locale: {
            format: 'YYYY-MM-DD',
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
            ],
        },
        autoUpdateInput: false,
    };
    recipientForm: any = new FormGroup({});
    showCriteria: boolean = false;

    constructor(private emailService: EmailService, private notifyService: NotificationService,
        private fb: FormBuilder, private router: Router, private clinicService: ClinicService) { }
    ngOnInit(): void {
        this.initRecipientForm();
        this.getSpecialtyList();
        // this.getServiceList();
        this.getSpecialistList();

        this.recipientForm.valueChanges.subscribe((res: any) => {
                this.onFilterPatient();
        });
    }

    initRecipientForm() {
        this.recipientForm = this.fb.group({
        patient_with: ['', Validators.required],
        appointment_from: [''],
        appointment_to: [''],
        age_from: [''],
        age_to: [''],
        specialty: [''],
        specialist: [''],
        services: [''],
        });
    }


    getSpecialtyList() {
        this.emailService.getSpecialtyList().subscribe((res: any) => {
            this.specialtyList = res.specialty.map((item: any) => {
                return {
                    id: item.id,
                    text: item.name,
                    item,
                }
            });
        }, (err: any) => {
            this.notifyService.error('Algo salió mal');
        });
    }

    getSpecialistList() {
        this.clinicService.getDoctors(this.selectedSpecialty?.id).subscribe((res: any) => {
            this.specialistList = res.data.map((doctor: any) => {
                return {
                    id: doctor?.user.id,
                    doctor,
                    text: doctor?.user.first_name + ' ' + doctor?.user.last_name,
                }
            });
        }, (err: any) => {
            this.notifyService.error('Algo salió mal');
        });
    }

    getServiceList() {
        this.emailService.getServiceList(this.selectedSpecialty?.id).subscribe((res: any) => {
            this.serviceList = res.Services.map((item: any) => {
                return {
                    id: item.id,
                    text: item.name,
                    item,
                }
            });
        }, (err: any) => {
            this.notifyService.error('Algo salió mal');
        });
    }

    selectAppointFrom(event: any) {
        this.recipientForm.patchValue({
            appointment_from: event.picker.startDate.format('YYYY-MM-DD'),
        });
        this.datePickerOptions.autoUpdateInput = true;
    }

    selectAppointTo(event: any) {
        this.recipientForm.patchValue({
            appointment_to: event.picker.startDate.format('YYYY-MM-DD'),
        });
        this.datePickerOptions1.autoUpdateInput = true;

    }

    onSelectionChanges(event: any) {
        this.selectedSpecialty = event[0].data.item;
    }
    
    onFilterPatient() {
        if (this.recipientForm.invalid) return;
        this.emailService.filterPatient(this.recipientForm.value).subscribe((res: any) => {
            this.patienceCriteria = res;
            this.showCriteria = true;
        }
        , (err: any) => {
            this.notifyService.error('Algo salió mal');
            this.showCriteria = false;
        });
    }

    navigateToCreateCampaign() {
        if (this.recipientForm.invalid) {
            this.notifyService.error('Por favor, complete los campos requeridos');
            return;
        };
        this.emailService.campaignCriteria = of(this.recipientForm.value);
        this.router.navigate(['/email-marketing/create-campaign']);
    }
}