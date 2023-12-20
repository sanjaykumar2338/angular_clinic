import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ClinicService } from 'src/app/services/clinic.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'create-schedule',
  templateUrl: './create-schedule.component.html',
  styleUrls: ['./create-schedule.component.scss'],
})
export class CreateScheduleComponent implements OnInit {
  public doctorAvailibilityForm: any = new FormGroup({}) as any;
  doctorList: any[] = [];
  datePickerOptions: any = {
    locale: {
      format: 'YYYY-MM-DD',
      daysOfWeek: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
      monthNames: [
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'Mayo',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
        'Nov',
        'Dic',
      ],
    },
    alwaysShowCalendars: false,
    autoApply: true,
  };
  datePickerOptions2 = {
    ...this.datePickerOptions,
    minDate: new Date(),
  };
  dateRange: any = {
    from: moment(new Date()).format('YYYY-MM-DD'),
    to: moment(new Date()).format('YYYY-MM-DD'),
  };
  rooms: any[] = [];
  slotList: any[] = [];
  doctorId: string = '';
  minTime: string = '08:00';
  maxTime: string = '22:00';
  p: number = 1;
  listInProcess: boolean = false;
  constructor(
    private fb: FormBuilder,
    private clinicSvc: ClinicService,
    private configurationSvc: ConfigurationService,
    private notifySvc: NotificationService
  ) {}

  ngOnInit(): void {
    moment.locale('es');
    this.initAvailibilityForm();
    this.getRooms();
    this.getDoctorList();
    this.getDoctorsAvailibility();
  }

  public initAvailibilityForm() {
    this.doctorAvailibilityForm = this.fb.group({
      doctor: ['', Validators.required],
      from: [moment().format('YYYY-MM-DD'), Validators.required],
      to: [moment().format('YYYY-MM-DD'), Validators.required],
      room: ['', Validators.required],
      duration: ['', Validators.required],
      days: this.fb.array([this.initDaysForm()]),
    });
  }

  private initDaysForm() {
    return this.fb.group({
      day: [moment(new Date()).format('dddd'), Validators.required],
      date: [moment(new Date()).format('YYYY-MM-DD'), Validators.required],
      slots: this.fb.array([this.initSlotsForm()]),
      checked: [true],
    });
  }

  private initSlotsForm() {
    return this.fb.group({
      startTime: ['08:00', Validators.required],
      endTime: ['22:00', Validators.required],
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
        this.rooms = res.data.map((item: any) => {
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

  selectedDate(value: any) {
    this.doctorAvailibilityForm.controls.from.setValue(
      moment(value.start).format('YYYY-MM-DD')
    );
    this.doctorAvailibilityForm.controls.to.setValue(
      moment(value.end).format('YYYY-MM-DD')
    );

    const days = this.getDaysName();
    this.doctorAvailibilityForm.controls.days = this.fb.array([]);
    this.addDays(days);
  }

  getDaysName() {
    const startDate = moment(this.doctorAvailibilityForm.value.from);
    const endDate = moment(this.doctorAvailibilityForm.value.to);
    const days = [];
    while (startDate <= endDate) {
      days.push({
        day: startDate.format('dddd'),
        date: startDate.format('YYYY-MM-DD'),
      });
      startDate.add(1, 'days');
    }
    return days;
  }

  addDays(days: any[]) {
    const control = [] as any;
    days.forEach((item: any) => {
      const newControl = this.initDaysForm();
      newControl.controls.day.setValue(item.day);
      newControl.controls.date.setValue(item.date);
      control.push(newControl);
    });
    this.doctorAvailibilityForm.controls.days = this.fb.array(control);
  }

  addSlot(index: number) {
    const control = this.doctorAvailibilityForm.controls.days.controls[
      index
    ].get('slots') as any;
    control.insert(index, this.initSlotsForm());
  }

  removeSlot(index: number, slotIndex: number) {
    const control = this.doctorAvailibilityForm.controls.days.controls[
      index
    ].get('slots') as any;
    control.removeAt(slotIndex);
  }

  saveDoctorAvailibility() {
    if (this.doctorAvailibilityForm.invalid) {
      if (this.doctorAvailibilityForm.value.doctor === '') {
        this.notifySvc.error('Por favor seleccione un doctor');
      } else if (this.doctorAvailibilityForm.value.room === '') {
        this.notifySvc.error('Por favor seleccione una sala');
      } else if (this.doctorAvailibilityForm.value.from === '') {
        this.notifySvc.error('Por favor seleccione una fecha');
      } else if (this.doctorAvailibilityForm.value.duration === '') {
        this.notifySvc.error('Por favor seleccione una duración');
      }
      return;
    }
    this.configurationSvc
      .addDoctorAvailability(this.doctorAvailibilityForm.value)
      .subscribe(
        (res) => {
          this.notifySvc.success('Horario creado exitosamente');
          this.initAvailibilityForm();
          this.getDoctorsAvailibility();
        },
        (err) => {
          this.notifySvc.error(err.error.message);
        }
      );
  }

  getDoctorsAvailibility() {
    this.listInProcess = true;
    this.configurationSvc
      .getDoctorAvailability(this.dateRange, this.doctorId)
      .subscribe(
        (res) => {
          this.slotList = res.slot
            .map((item: any) => {
              return this.flattenSlotsDuration(item.days, item);
            })
            .flat();
          this.listInProcess = false;
        },
        (err) => {
          this.notifySvc.error('Algo salio mal');
        }
      );
  }

  flattenSlotsDuration(slots: any[], parent?: any) {
    const arr = [] as any;
    slots.forEach((item) => {
      item.slots.forEach((slot: any) => {
        slot.slotsduration.forEach((duration: any) => {
          arr.push({
            day: item.day,
            date: item.date,
            startTime: duration.startTime,
            endTime: duration.endTime,
            id: parent.id,
            room_name: parent.room_name,
            doctor_name: parent.doctor_name,
            status: parent.status,
          });
        });
      });
    });
    return arr;
  }

  deleteDoctorAvailability(id: string) {
    this.notifySvc.confirmDialog().then((res) => {
      if (res.isConfirmed) {
        this.configurationSvc.deleteDoctorAvailability(id).subscribe(
          (res) => {
            this.notifySvc.success('Horario eliminado exitosamente');
            this.getDoctorsAvailibility();
          },
          (err) => {
            this.notifySvc.error('Algo salio mal');
          }
        );
      }
    });
  }

  deleteTimeSlot(id: string, day: string, startTime: string, endTime: string) {
    this.notifySvc.confirmDialog().then((res) => {
      if (res.isConfirmed) {
        this.configurationSvc
          .deleteTimeSlot(id, day, startTime, endTime)
          .subscribe(
            (res) => {
              this.notifySvc.success('Horario eliminado exitosamente');
              this.getDoctorsAvailibility();
            },
            (err) => {
              this.notifySvc.error('Algo salio mal');
            }
          );
      }
    });
  }

  filterByDate(value: any) {
    this.dateRange = {
      from: moment(value.start).format('YYYY-MM-DD'),
      to: moment(value.end).format('YYYY-MM-DD'),
    };
    this.getDoctorsAvailibility();
  }

  onSelectionChanges(ev: any) {
    this.doctorId = ev[0].value;
    this.getDoctorsAvailibility();
  }

  validateEndTime(index: number, slotIndex: number) {
    const control = this.doctorAvailibilityForm.controls.days.controls[
      index
    ].get('slots') as any;
    const startTime = control.controls[slotIndex].get('startTime').value;
    const endTime = control.controls[slotIndex].get('endTime').value;
    if (this.validateMaxTime(endTime, control, slotIndex)) {
      if (startTime >= endTime) {
        this.notifySvc.error(
          'La hora de finalización no puede ser inferior a la hora de inicio.'
        );
        control.controls[slotIndex].get('endTime').setValue(startTime);
      } else {
        control.controls[slotIndex].get('endTime').setErrors(null);
      }
    } else {
      this.notifySvc.error(
        `La hora de finalización no puede ser superior a ${this.maxTime}.`
      );
      control.controls[slotIndex].get('endTime').setValue(this.maxTime);
    }
  }

  validateStartTime(index: number, slotIndex: number) {
    const control = this.doctorAvailibilityForm.controls.days.controls[
      index
    ].get('slots') as any;
    const startTime = control.controls[slotIndex].get('startTime').value;
    const endTime = control.controls[slotIndex].get('endTime').value;
    if (this.validateMinTime(startTime)) {
      if (startTime >= endTime) {
        this.notifySvc.error(
          'La hora de inicio no puede ser superior a la hora de finalización.'
        );
        control.controls[slotIndex].get('startTime').setValue(endTime);
      } else {
        control.controls[slotIndex].get('startTime').setErrors(null);
      }
    } else {
      this.notifySvc.error(
        `La hora de inicio no puede ser inferior a ${this.minTime}.`
      );
      control.controls[slotIndex].get('startTime').setValue(this.minTime);
    }
  }

  validateMinTime(startTime: string) {
    if (startTime < this.minTime) {
      return false;
    }
    return true;
  }

  validateMaxTime(endTime: string, control: any, slotIndex: any) {
    if (endTime > this.maxTime) {
      return false;
    }
    return true;
  }
}
