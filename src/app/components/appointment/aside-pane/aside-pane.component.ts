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
import * as moment from 'moment';
import { AppointmentService } from 'src/app/services/appointment.service';
import { ClinicService } from 'src/app/services/clinic.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { NotificationService } from 'src/app/services/notification.service';
import { RevenueService } from 'src/app/services/revenue.service';

@Component({
  selector: 'schedule-new-appointment',
  templateUrl: './aside-pane.component.html',
  styleUrls: ['./aside-pane.component.css'],
})
export class ScheduleAppointmentAside implements OnInit, OnChanges {
  @Input() selectedSlotDetail: any = null;
  @Input() groupBy: any = null;
  @Input() asideState: any = {
    hidden: true,
  };
  @Output() onAppointmentSuccess: EventEmitter<any> = new EventEmitter();
  appointmentForm: any = new FormGroup({}) as any;
  patientList: any[] = [];
  roomsList: any[] = [];
  serviceList: any[] = [];
  doctorList: any[] = [];
  moment: any = moment;
  onCloseEvent: EventEmitter<any> = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private revenueService: RevenueService,
    private clinicSvc: ClinicService,
    private notifySvc: NotificationService,
    private configurationSvc: ConfigurationService,
    private appointmentSvc: AppointmentService
  ) {
    moment.locale('es-ES');
    this.initAppointmentForm();
  }

  ngOnInit() {
    this.getPatients();
    this.getDoctorList();
    this.getRooms();
  }

  initAppointmentForm() {
    this.appointmentForm = this.fb.group({
      patient: ['', Validators.required],
      doctor: ['', Validators.required],
      room: ['', Validators.required],
      service: [''],
      description: [''],
      duration: ['', Validators.required],
      date: [moment().format('YYYY-MM-DD'), Validators.required],
      slot: [
        this.fb.group({
          startTime: ['', Validators.required],
          endTime: ['', Validators.required],
        }),
        Validators.required,
      ],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.selectedSlotDetail) {
      this.appointmentForm.patchValue({
        ...this.selectedSlotDetail,
        room: this.selectedSlotDetail.room.id,
      });
      if (this.groupBy === 'doctor') {
        this.getServices(this.selectedSlotDetail.doctor.id);
      }
    }
  }

  closeAside() {
    this.selectedSlotDetail = null;
    this.appointmentForm.reset();
    this.asideState = {
      hidden: true,
    };
    this.onCloseEvent.emit(true);
  }

  onSubmit() {
    this.appointmentForm.markAllAsTouched();
    if (this.appointmentForm.invalid) {
      this.notifySvc.error('Por favor complete todos los campos requeridos');
    } else {
      if (this.groupBy === 'room') {
        this.appointmentForm.patchValue({
          room: this.selectedSlotDetail.room.id,
        });
      } else {
        this.appointmentForm.patchValue({
          doctor: this.selectedSlotDetail.doctor.id,
        });
      }
      this.appointmentSvc.addAppointment(this.appointmentForm.value).subscribe(
        (res) => {
          this.appointmentForm.reset();
          this.notifySvc.success('Cita creada exitosamente');
          this.onAppointmentSuccess.emit(true);
          this.closeAside();
        },
        (err) => {
          this.notifySvc.error('Algo salio mal');
        }
      );
    }
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

  getRooms() {
    this.configurationSvc.getRooms().subscribe(
      (res) => {
        this.roomsList = res.data.map((item: any) => {
          return {
            id: item.id,
            text: item.name,
          };
        });
      },
      (err) => {
        this.notifySvc.error('Algo salio mal');
      }
    );
  }

  onDurationChange(event: any) {
    this.appointmentForm.patchValue({
      slot: {
        startTime: this.appointmentForm.value.slot.startTime,
        endTime: this.moment(this.appointmentForm.value.slot.startTime, 'HH:mm')
          .add(event.target.value, 'minutes')
          .format('HH:mm'),
      },
      duration: event.target.value,
    });
  }

  getServices(id: any) {
    this.configurationSvc.getServiceByDoctor(id).subscribe((res) => {
      this.serviceList = res.services.map((item: any) => {
        return {
          id: item.id,
          text: item.name,
        };
      });
    });
  }

  onDoctorChange(event: any) {
    if (event.length) {
      const doctor = event[0].value;
      this.getServices(doctor);
    }
  }
}
