import { ChangeDetectorRef, Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import * as moment from "moment";
import { Subject, debounceTime } from "rxjs";
import { AuthService } from "src/app/services/auth.service";
import { ClinicService } from "src/app/services/clinic.service";
import { NotificationService } from "src/app/services/notification.service";
import { NursingService } from "src/app/services/nursing.service";
import { PatientRecord } from "./PatientRecord";
import { diagnosisList, expectedResult, interventionList } from "./diagnosisList";

@Component({
    selector: "add-new-sheet",
    templateUrl: "./add-new-sheet.component.html",
    styleUrls: ["./add-new-sheet.component.scss"],
})

export class AddNewSheetComponent {
    fileId$: Subject<string> = new Subject<string>();
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
    fileDetails: any = new PatientRecord();
    expedienteId: string = '';
    dob: any = null;
    actualWeight: any = null;
    visitCount: any = 1;
    idealWeight: any = null;
    height: any = null;
    bloodPressure: any = null;
    heartRate: any = null;
    respiratoryRate: any = null;
    temperature: any = null;
    headCircumference: any = null;
    abdominalCircumference: any = null;
    hipCircumference: any = null;
    visitDate: any = moment().format('YYYY-MM-DD');
    visitTime: any = null;
    age: any = null;
    bmi: any = null;
    diabetes: string = 'No';
    hypertension: string = 'No';
    obesity: string = 'No';
    dyslipidemias: string = 'No';
    otherChronicDiseases: string = '';
    visitConsultation: string = '';
    diagnosisNursing: string = '';
    expectedResults: string = '';
    interventionsRecommendations: string = '';
    appliedCode: string = '';
    classificationResult: string = '';
    loggedInUser: any = null;
    observation: any = null;
    nurseName: any = null;
    nurseList: any = [];
    signatureImagePath: any = null;
    doctorList: any = [];
    doctorName: any = null;
    moment = moment.locale('es');
    diagnosisList: any = diagnosisList;
    interventionList: any = interventionList;
    expectedResultList: any = expectedResult;

    constructor(
        private nursingSvc: NursingService,
        private cdr: ChangeDetectorRef,
        private authService: AuthService,
        private notification: NotificationService,
        private clinicSvc: ClinicService, 
        private activatedRoute: ActivatedRoute
    ) {}
    
    ngOnInit(): void {
        
          this.clinicSvc.getDoctors().subscribe((res) => {
            this.doctorList = res.data;
          });
        this.nursingSvc.getNurse().subscribe((res) => {
            this.nurseList = res.nurse;
            this.signatureImagePath = `${res.image_path}/`;
        });
        
        this.loggedInUser = this.authService.getUserDetail();
        this.fileId$.pipe(debounceTime(500)).subscribe((fileId: string) => {
            if (fileId) {
                this.nursingSvc.getFileById(fileId).subscribe((res) => {
                   this.fileDetails = new PatientRecord(res.doctor_patient);
                   this.getDateOfBirth(this.fileDetails.dob);
                   const doctor = this.doctorList.find((doctor: any) => doctor.id === this.fileDetails.doctor_id);
                   if (doctor) {
                          this.doctorName = doctor.user.first_name + ' ' + doctor.user.last_name;
                   }
                });
            }
        });

        this.activatedRoute.queryParams.subscribe((param: any) => {
            if  (param.sheetId) {
                this.expedienteId = param.sheetId;
                this.fileId$.next(param.sheetId);
            }
        });
    }

    onfileIdChange(event: any) {
        this.fileId$.next(event.target.value);
    }

    savePatientFile() {
        this.nursingSvc.savePatientFile(this.fileDetails).subscribe((res) => {
            this.notification.success('Registro agregado exitosamente');
            console.log(res);
        });
    }
    
    addActualWeight() {
        this.validateValueBeforeAdd(this.actualWeight) && !this.checkIfValueExistForVisit(this.fileDetails.vitalSignAssement.actualWeight, this.visitCount) ?
        this.fileDetails.vitalSignAssement.actualWeight.push({
            visit: this.visitCount,
            value: this.actualWeight,
        }) : this.notification.error('Ya existe un registro para este campo');
        // this.calculateBMIClassification();
    }

    addIdealWeight() {
        this.validateValueBeforeAdd(this.idealWeight) && !this.checkIfValueExistForVisit(this.fileDetails.vitalSignAssement.idealWeight, this.visitCount) ?
        this.fileDetails.vitalSignAssement.idealWeight.push({
            visit: this.visitCount,
            value: this.idealWeight,
        }) : this.notification.error('Ya existe un registro para este campo');
    }

    addHeight() {
      this.validateValueBeforeAdd(this.height) && !this.checkIfValueExistForVisit(this.fileDetails.vitalSignAssement.height, this.visitCount) ?
        this.fileDetails.vitalSignAssement.height.push({
            visit: this.visitCount,
            value: this.height,
        }) : this.notification.error('Ya existe un registro para este campo');
        // this.calculateBMIClassification();
    }

    addTemperature() {
      this.validateValueBeforeAdd(this.temperature) && !this.checkIfValueExistForVisit(this.fileDetails.vitalSignAssement.temperature, this.visitCount) ?
        this.fileDetails.vitalSignAssement.temperature.push({
            visit: this.visitCount,
            value: this.temperature,
        }) : this.notification.error('Ya existe un registro para este campo');
    }

    addBloodPressure() {
      this.validateValueBeforeAdd(this.bloodPressure) && !this.checkIfValueExistForVisit(this.fileDetails.vitalSignAssement.bloodPressure, this.visitCount) ?
        this.fileDetails.vitalSignAssement.bloodPressure.push({
            visit: this.visitCount,
            value: this.bloodPressure,
        }) : this.notification.error('Ya existe un registro para este campo');
    }

    addHeartRate() {
      this.validateValueBeforeAdd(this.heartRate) && !this.checkIfValueExistForVisit(this.fileDetails.vitalSignAssement.heartRate, this.visitCount) ?
        this.fileDetails.vitalSignAssement.heartRate.push({
            visit: this.visitCount,
            value: this.heartRate,
        }) : this.notification.error('Ya existe un registro para este campo');
    }

    addRespiratoryRate() {
      this.validateValueBeforeAdd(this.respiratoryRate) && !this.checkIfValueExistForVisit(this.fileDetails.vitalSignAssement.respiratoryRate, this.visitCount) ?
        this.fileDetails.vitalSignAssement.respiratoryRate.push({
            visit: this.visitCount,
            value: this.respiratoryRate,
        }) : this.notification.error('Ya existe un registro para este campo');
    }

    addHeadCircumference() {
      this.validateValueBeforeAdd(this.headCircumference) && !this.checkIfValueExistForVisit(this.fileDetails.vitalSignAssement.headCircumference, this.visitCount) ?
        this.fileDetails.vitalSignAssement.headCircumference.push({
            visit: this.visitCount,
            value: this.headCircumference,
        }) : this.notification.error('Ya existe un registro para este campo');
    }

    addAbdominalCircumference() {
      this.validateValueBeforeAdd(this.abdominalCircumference) && !this.checkIfValueExistForVisit(this.fileDetails.vitalSignAssement.abdominalCircumference, this.visitCount) ?
        this.fileDetails.vitalSignAssement.abdominalCircumference.push({
            visit: this.visitCount,
            value: this.abdominalCircumference,
        }) : this.notification.error('Ya existe un registro para este campo');
    }

    addHipCircumference() {
        this.validateValueBeforeAdd(this.hipCircumference) && !this.checkIfValueExistForVisit(this.fileDetails.vitalSignAssement.hipCircumference, this.visitCount) ?
        this.fileDetails.vitalSignAssement.hipCircumference.push({
            visit: this.visitCount,
            value: this.hipCircumference,
        }) : this.notification.error('Ya existe un registro para este campo');
    }

    addVisitDate() {
        this.validateValueBeforeAdd(this.visitDate) && !this.checkIfValueExistForVisit(this.fileDetails.vitalSignAssement.date, this.visitCount) ?
        this.fileDetails.vitalSignAssement.date.push({
            visit: this.visitCount,
            value: this.visitDate,
        }) : this.notification.error('Ya existe un registro para este campo');
    }

    addVisitTime() {
        this.validateValueBeforeAdd(this.visitTime) && !this.checkIfValueExistForVisit(this.fileDetails.vitalSignAssement.time, this.visitCount) ?
        this.fileDetails.vitalSignAssement.time.push({
            visit: this.visitCount,
            value: this.visitTime,
        }) : this.notification.error('Ya existe un registro para este campo');
    }

    addAge() {
      this.validateValueBeforeAdd(this.age) && !this.checkIfValueExistForVisit(this.fileDetails.vitalSignAssement.age, this.visitCount) ?
      this.fileDetails.vitalSignAssement.age.push({
          visit: this.visitCount,
          value: this.age,
      }) : this.notification.error('Ya existe un registro para este campo');
    }

    addBmi() {
      this.validateValueBeforeAdd(this.bmi) && !this.checkIfValueExistForVisit(this.fileDetails.vitalSignAssement.bmi, this.visitCount) ?
      this.fileDetails.vitalSignAssement.bmi.push({
          visit: this.visitCount,
          value: this.bmi,
      }) : this.notification.error('Ya existe un registro para este campo');
    //   this.calculateBMIClassification();
    }

    validateValueBeforeAdd(value: any): boolean {
        return value && value !== '';
    }

    addDiabetes() {
        this.validateValueBeforeAdd(this.fileDetails.chronicDiseases.diabetes) && !this.checkIfValueExistForVisit(this.fileDetails.chronicDiseases.diabetes, this.visitCount) ?
        this.fileDetails.chronicDiseases.diabetes.push({
            visit: this.visitCount,
            value: this.diabetes,
        }) : this.notification.error('Ya existe un registro para este campo');
    }

    addHypertension() {
        this.validateValueBeforeAdd(this.fileDetails.chronicDiseases.hypertension) && !this.checkIfValueExistForVisit(this.fileDetails.chronicDiseases.hypertension, this.visitCount) ?
        this.fileDetails.chronicDiseases.hypertension.push({
            visit: this.visitCount,
            value: this.hypertension,
        }) : this.notification.error('Ya existe un registro para este campo');
    }

    addObesity() {
        this.validateValueBeforeAdd(this.fileDetails.chronicDiseases.obesity) && !this.checkIfValueExistForVisit(this.fileDetails.chronicDiseases.obesity, this.visitCount) ?
        this.fileDetails.chronicDiseases.obesity.push({
            visit: this.visitCount,
            value: this.obesity,
        }) : this.notification.error('Ya existe un registro para este campo');
    }

    addDyslipidemias() {
        this.validateValueBeforeAdd(this.fileDetails.chronicDiseases.dyslipidemias)
        && !this.checkIfValueExistForVisit(this.fileDetails.chronicDiseases.dyslipidemias, this.visitCount) ?
        this.fileDetails.chronicDiseases.dyslipidemias.push({
            visit: this.visitCount,
            value: this.dyslipidemias,
        }) : this.notification.error('Ya existe un registro para este campo');
    }

    addOthers() {
        this.validateValueBeforeAdd(this.fileDetails.chronicDiseases.others)
        && !this.checkIfValueExistForVisit(this.fileDetails.chronicDiseases.others, this.visitCount) ?
        this.fileDetails.chronicDiseases.others.push({
            visit: this.visitCount,
            value: this.otherChronicDiseases,
        }) : this.notification.error('Ya existe un registro para este campo');
    }

    addVisitConsultation() {
        this.validateValueBeforeAdd(this.visitConsultation) &&
        this.fileDetails.visitsConsultations.push({
            visit: this.visitCount,
            value: this.visitConsultation,
        });
    }

    addDiagnosisNursing() {
        this.validateValueBeforeAdd(this.diagnosisNursing) &&
        this.fileDetails.diagnosisNursing.push({
            visit: this.visitCount,
            value: this.diagnosisNursing,
        });
    }

    addExpectedResults() {
        this.validateValueBeforeAdd(this.expectedResults) &&
        this.fileDetails.expectedResults.push({
            visit: this.visitCount,
            value: this.expectedResults,
        });
    }

    addInterventionsRecommendations() {
        this.validateValueBeforeAdd(this.interventionsRecommendations) &&
        this.fileDetails.interventionsRecommendations.push({
            visit: this.visitCount,
            value: this.interventionsRecommendations,
        });
    }

    addAppliedCode() {
        this.validateValueBeforeAdd(this.appliedCode) &&
        this.fileDetails.appliedCodes.push({
            code: this.appliedCode,
            nurse: this.loggedInUser.first_name  + ' ' + this.loggedInUser.last_name,
            nurse_id: this.loggedInUser.nurse_id,
            date: moment().format('YYYY-MM-DD'),
            time: moment().format('HH:mm:ss'),
        });
        this.fileDetails.observations.push({
            observation: this.observation,
            nurse: this.loggedInUser.first_name  + ' ' + this.loggedInUser.last_name,
            nurse_id: this.loggedInUser.nurse_id,
            date: moment().format('YYYY-MM-DD'),
            time: moment().format('HH:mm:ss'),
        });
    }

    onSelectDate(event: any) {
        this.visitDate = event.start.format('YYYY-MM-DD');
    }
    
    calculateBMI(): number {
        if (this.actualWeight && this.height) {
          return this.actualWeight / Math.pow(this.height / 100, 2);
        } else {
          return 0;
        }
      }
    
      // This method returns the BMI classification based on the BMI value
      getBMIClassification(bmi: number): string {
        if (bmi < 18.5) {
          return 'Bajo peso (Underweight)';
        } else if (bmi >= 18.5 && bmi <= 24.9) {
          return 'Normal (Normal weight)';
        } else if (bmi >= 25 && bmi <= 29.9) {
          return 'Sobrepeso (Overweight)';
        } else if (bmi >= 30 && bmi <= 34.9) {
          return 'Obesidad (Obesity class I)';
        } else {
          return 'Classification not available';
        }
      }
    
      // This method is called when the "Add" button is clicked
      calculateBMIClassification(): void {
        const bmi = this.calculateBMI();
        this.classificationResult = this.getBMIClassification(bmi);
      }

      addNutritionControl() {
        this.validateValueBeforeAdd(this.fileDetails.nutritionControl) &&
        this.fileDetails.nutritionControl.push({
            visit: this.visitCount,
            value: this.classificationResult,
        });
    }

    addSignatures() {
        if(this.validateValueBeforeAdd(this.fileDetails.signatures)) {
            const nurse = this.findNurseByName();
            this.fileDetails.signatures.push({
                ...nurse,
                date: moment().format('YYYY-MM-DD'),
                time: moment().format('HH:mm:ss'),
            });
            if (nurse) {
                this.savePatientFile();
            }
        }
    }

    findNurseByName() {
        return this.nurseList.find((nurse: any) => nurse.name.toLocaleLowerCase() === this.nurseName.toLocaleLowerCase());
    }

    getDateOfBirth(birthDate: string) {
        this.dob = {
            day: birthDate.split('-')[2],
            month: moment(birthDate.split('-')[1], 'MM').format('MMMM'),
            year: birthDate.split('-')[0],
        };
    }

    checkIfValueExistForVisit(value: any, visit: number): boolean {
        return value.find((val: any) => val.visit === visit);
    }

    getOrdinal(number: number): string {
        if (number <= 0) {
          return 'Invalid index';
        }
    
        const numberAsString = number.toString();
        const lastDigit = +numberAsString[numberAsString.length - 1];
    
        switch (lastDigit) {
          case 1:
            return number === 11 ? `${number}th` : `${number}st`;
          case 2:
            return number === 12 ? `${number}th` : `${number}nd`;
          case 3:
            return number === 13 ? `${number}th` : `${number}rd`;
          default:
            return `${number}th`;
        }
      }

}