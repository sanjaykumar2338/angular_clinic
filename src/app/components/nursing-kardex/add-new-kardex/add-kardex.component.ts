import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Subject, debounceTime } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ClinicService } from 'src/app/services/clinic.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NursingService } from 'src/app/services/nursing.service';

@Component({
  selector: 'add-kardex',
  templateUrl: './add-kardex.component.html',
  styleUrls: ['./add-kardex.component.scss'],
})
export class AddNursingKardexComponent implements OnInit {

  nurseList: any = [];
  selectedNurse: any = null;
  showLoader: boolean = false;
  dob: any = null;
  nursingComment: any = null;
  otherComments: any = null;
  patientForm: any = {
    patient_id: '',
    expediente_id: '',
    doctor_id: '',
    fullname: "",
    gender: "",
    dob: "",
    allergies: {
      hasAllergy: "",
      specificAllergy: "",
    },
    diagnosis: "",
    location: "",
    diet: "",
    formula: "",
    medicines: [],
    nursingComment: [],
    others: []
  };
  medicineForm: any = {
    medicine: '',
    dose: '',
    appliedTime: '',
    date: moment().format('YYYY-MM-DD'),
    comment: '',
    nurse: {
      name: '',
      id: ''
    }
  };
  otherForm: any = null;
  nursingCommentForm: any = null;
  fileId$: Subject<string> = new Subject<string>();
  doctorList: any = [];
  doctorName: string = '';
  loggedInUser: any = null;
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
  constructor(
    private nursingSvc: NursingService,
    private notification: NotificationService,
    private authService: AuthService,
    private clinicSvc: ClinicService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.nursingSvc.getAllFile().subscribe( (res: any) => {
      console.log(res);
    });

    this.clinicSvc.getDoctors().subscribe((res) => {
      this.doctorList = res.data;
    });

    this.loggedInUser = this.authService.getUserDetail();
    this.fileId$.pipe(debounceTime(500)).subscribe((fileId: string) => {
        if (fileId) {
            this.nursingSvc.getKardexSheetById(fileId).subscribe((res) => {
               this.patientForm = res.patient
               this.getDateOfBirth(this.patientForm.dob);
               const doctor = this.doctorList.find((doctor: any) => doctor.id === this.patientForm.doctor_id);
               if (doctor) {
                      this.doctorName = doctor.user.first_name + ' ' + doctor.user.last_name;
               }
            });
        }
    });

    this.activatedRoute.queryParams.subscribe((param: any) => {
      if  (param.sheetId) {
        this.patientForm.expediente_id = param.sheetId;
          this.fileId$.next(param.sheetId);
      }
  });
  }


  getDateOfBirth(birthDate: string) {
    this.dob = {
        day: birthDate.split('-')[2],
        month: moment(birthDate.split('-')[1], 'MM').format('MMMM'),
        year: birthDate.split('-')[0],
    };
  }

  onfileIdChange(event: any) {
    this.fileId$.next(event.target.value);
  }
  
  saveSheet(form: any) {
    this.nursingSvc.saveKardexSheet(form, this.patientForm.patient_id).subscribe( (res: any) => {
      this.patientForm = res.patient;
      // this.notification.success('Nursing Sheet Saved Successfully');
    }, (err: any) => {
      this.notification.error(err);
    });
  }
  
  onSubmitMedicineForm() {
    if (
      this.medicineForm.medicine &&
      this.medicineForm.dose &&
      this.medicineForm.date &&
      this.medicineForm.via &&
      this.medicineForm.comment
    ) {
      const loggedInNurse = {
        name: this.loggedInUser.first_name + ' ' + this.loggedInUser.last_name,
        id: this.loggedInUser.nurse_id
      };
      this.medicineForm.nurse = loggedInNurse;
      const medicineArray = this.patientForm.medicines;
      medicineArray.push(this.medicineForm);
      this.saveSheet({medicines: medicineArray});
      this.medicineForm = {
        medicine: '',
        dose: '',
        appliedTime: '',
        date: moment().format('YYYY-MM-DD'),
        comment: '',
        nurse: {
          name: '',
          id: ''
        }
      };
    } else {
      this.notification.error('Please fill in required fields');
    }
  }

  onSubmitOtherForm() {
    if (
      this.otherComments
    ) {
      const otherCommentModel = {
        comment: this.otherComments,
        nurse: {
          name: this.loggedInUser.first_name + ' ' + this.loggedInUser.last_name,
          id: this.loggedInUser.nurse_id
        },
        date: moment().format('YYYY-MM-DD HH:mm:ss'),
        appliedTime: '',
        applied: false
      };
      const otherCommentArray = this.patientForm.others;
      otherCommentArray.push(otherCommentModel);
      this.saveSheet(this.patientForm);
      this.otherComments = null;
    } else {
      this.notification.error('Please fill in required fields');
    }
  }

  onSubmitNursingCommentForm() {
    if (this.nursingComment) {
      const nursingCommentModel = {
        comment: this.nursingComment,
        nurse: {
          name: this.loggedInUser.first_name + ' ' + this.loggedInUser.last_name,
          id: this.loggedInUser.nurse_id
        },
        date: moment().format('YYYY-MM-DD HH:mm:ss'),
      };
      const nursingCommentArray = this.patientForm.nursingComment;
      nursingCommentArray.push(nursingCommentModel);
      this.saveSheet(this.patientForm);
      this.nursingComment = null;
    } else {
      this.notification.error('Please fill in required fields');
    }
  }

  onSelectDate(event: any) {
    this.medicineForm.date = event.start.format('YYYY-MM-DD');
  }

  onChangeInput(event: any) {
    this.saveSheet(this.patientForm);
  }

  onApplied(medicine: any) {
    medicine.applied = true;
    medicine.appliedTime = moment().format('HH:mm:ss');
    this.saveSheet(this.patientForm);
  }

}
