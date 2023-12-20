import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AppointmentService } from 'src/app/services/appointment.service';
import { ClinicService } from 'src/app/services/clinic.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss'],
})
export class AppointmentComponent implements OnInit {
  @Component({
    selector: 'appointment',
    templateUrl: './appointment.component.html',
    styleUrls: ['./appointment.component.scss'],
  })
  appointmentList: any[] = [];
  timeSlots: any[] = [];
  groupedData: { [key: string]: any[] } = {};
  doctorList: any[] = [];
  specialityList: any[] = [];
  groupByKey: string = 'doctor';
  selectedDate: string = moment().format('YYYY-MM-DD');
  moment: any = moment;
  asideState: any = {
    hidden: true,
  };
  selectedSlotDetail: any = null;
  doctorsSlots: any[] = [];

  rooms: any[] = [];
  roomsList: any[] = [];
  includedDoctor: any[] = [];
  includedRoom: any[] = [];
  loading: boolean = true;
  tableHeaders: any[] = [];
  leastDuration: number = 15;
  flattenSlots: any[] = [];
  private slotCache: Map<number, any[]> = new Map();
  constructor(
    private clinicSvc: ClinicService,
    private appointmentSvc: AppointmentService,
    private configurationSvc: ConfigurationService,
    private notifySvc: NotificationService
  ) {}

  ngOnInit(): void {
    moment.locale('es');
    this.selectedDate = moment().format('YYYY-MM-DD');
    this.getDoctorList();
    this.getRooms();
  }

  generateTimeSlots(startHour: number, endHour: number) {
    const timeSlots: any[] = [];
    const timeSlotInterval = 30;
    const startTime = startHour; // Start at 8:00 AM
    const endTime = endHour; // End at 12:00 AM (midnight)

    for (let i = startTime * 60; i <= endTime * 60; i += this.leastDuration) {
      const hours = Math.floor(i / 60);
      const minutes = i % 60;
      const time = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}`;
      timeSlots.push(time);
    }
    return timeSlots;
  }

  findLeastDurationAmongSlots(slots: any[]) {
    let leastDuration = 0;
    slots.forEach((slot) => {
      const duration = slot.duration;
      if (leastDuration === 0 || duration < leastDuration) {
        leastDuration = duration;
      }
    });

    return Number(leastDuration) || 30;
  }

  getAppointmentText(appointment: any) {
    return appointment
      ? `${appointment.patient.name} (${moment(
          appointment.appointmentSlot.startTime,
          'HH:mm'
        ).format('hh:mm A')} - ${moment(
          appointment.appointmentSlot.endTime,
          'HH:mm'
        ).format('hh:mm A')})`
      : null;
  }

  getDoctorList() {
    this.clinicSvc.getDoctors('doctors/list').subscribe((res) => {
      this.doctorList = res.data.map((item: any) => {
        return {
          id: item.id,
          text: `${item.user.first_name} ${item.user.last_name}`,
        };
      });
      this.specialityList = this.doctorList;
      this.getDoctorsAvailibility();
    });
  }

  searchDoctor(event: any) {
    this.specialityList = this.doctorList.filter((item: any) => {
      return item.text.toLowerCase().includes(event.target.value.toLowerCase());
    });
  }

  searchRoom(event: any) {
    const searchValue = event.target?.value;
    if (searchValue) {
      this.roomsList = this.rooms.filter((item: any) => {
        const itemText = item.text || '';
        return itemText.toLowerCase().includes(searchValue.toLowerCase());
      });
    } else {
    }
  }

  onDateChange(event: any) {
    this.loading = true;
    this.selectedDate = moment(event).format('YYYY-MM-DD');
    this.getDoctorsAvailibility();
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  nextDate() {
    this.loading = true;
    this.selectedDate = moment(this.selectedDate)
      .add(1, 'days')
      .format('YYYY-MM-DD');
    this.getDoctorsAvailibility();
  }

  previousDate() {
    this.loading = true;
    this.selectedDate = moment(this.selectedDate)
      .subtract(1, 'days')
      .format('YYYY-MM-DD');
    this.getDoctorsAvailibility();
  }

  openAside(id: number, timeSlot: string) {
    this.selectedSlotDetail = {
      date: this.selectedDate,
      slot: {
        startTime: timeSlot,
        endTime: null,
      },
      doctor: {
        id:
          this.groupByKey === 'doctor'
            ? this.doctorsSlots.find((item) => item.doctor === id).doctor
            : null,
        name:
          this.groupByKey === 'doctor'
            ? this.doctorsSlots.find((item) => item.doctor === id).doctor_name
            : null,
      },
      room: {
        id:
          this.groupByKey === 'room'
            ? this.rooms.find((item) => item.id === id).id
            : this.doctorsSlots.find((item) => item.doctor === id).room,
        name:
          this.groupByKey === 'room'
            ? this.rooms.find((item) => item.id === id).text
            : this.doctorsSlots.find((item) => item.doctor === id).room_namev,
      },
    };

    this.asideState = {
      hidden: false,
    };
  }

  getAppointmentList() {
    this.appointmentSvc.getAppointmentList(this.selectedDate).subscribe(
      (res) => {
        this.slotCache.clear();
        this.appointmentList = res.appointment;
        this.leastDuration = this.findLeastDurationAmongSlots(
          this.doctorsSlots
        );
        this.timeSlots = this.generateTimeSlots(8, 22);

        this.initializeSlotCache(this.doctorsSlots);
        this.switchAppointment(this.groupByKey);

        this.loading = false;
      },
      (err) => {
        this.notifySvc.error('Algo salio mal');
      }
    );
  }

  onAppointmentSuccess(event: any) {
    if (event) {
      this.getAppointmentList();
    }
  }

  onCloseEvent(event: any) {
    if (event) {
      this.selectedSlotDetail = null;
    }
  }

  getDoctorsAvailibility() {
    this.loading = true;
    const dateRange = {
      from: this.selectedDate,
      to: this.selectedDate,
    };
    this.configurationSvc.getDoctorAvailability(dateRange, '').subscribe(
      (res) => {
        this.doctorsSlots = res.slot;
        this.getAppointmentList();
      },
      (err) => {
        this.notifySvc.error('Algo salio mal');
      }
    );
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
        this.roomsList = this.rooms;
      },
      (err) => {
        this.notifySvc.error('Algo salio mal');
      }
    );
  }

  onSelectDoctor(id: any, event: any) {
    if (!event.target.checked) {
      this.includedDoctor.splice(this.includedDoctor.indexOf(id), 1);
    } else {
      this.includedDoctor.push(id);
    }
    if (this.includedDoctor.length === 0) {
      this.tableHeaders = this.specialityList;
      return;
    }
    this.tableHeaders = this.specialityList.filter((item) =>
      this.includedDoctor.includes(item.id)
    );
  }

  onSelectRoom(id: any, event: any) {
    if (!event.target.checked) {
      this.includedRoom.splice(this.includedRoom.indexOf(id), 1);
    } else {
      this.includedRoom.push(id);
    }
    if (this.includedRoom.length === 0) {
      this.tableHeaders = this.rooms;
      return;
    }
    this.tableHeaders = this.rooms.filter((item) =>
      this.includedRoom.includes(item.id)
    );
  }

  isAppointmentScheduled(doctorId: number, timeSlot: string) {
    // Filter appointments for the specified doctor
    const doctorAppointments = this.appointmentList.filter(
      (appointment) => appointment[this.groupByKey].id === doctorId
    );

    // Convert the timeSlot to a Moment.js object for comparison
    const timeSlotMoment = moment(timeSlot, 'HH:mm');

    // Find and return the matched appointment
    const matchedAppointment = doctorAppointments.find((appointment) => {
      const startTimeMoment = moment(
        appointment.appointmentSlot.startTime,
        'HH:mm'
      );
      const endTimeMoment = moment(
        appointment.appointmentSlot.endTime,
        'HH:mm'
      );

      // Check if the timeSlotMoment is within the appointment's time range or if it falls within the first half of a one-hour appointment
      return (
        timeSlotMoment.isBetween(startTimeMoment, endTimeMoment, null, '[)') ||
        (timeSlotMoment.isSameOrAfter(startTimeMoment) &&
          timeSlotMoment.isBefore(
            startTimeMoment.clone().add(this.leastDuration, 'minutes')
          ))
      );
    });

    return matchedAppointment || null;
  }

  getAppointmentRowspan(doctorId: number, timeSlot: string) {
    const appointment = this.isAppointmentScheduled(doctorId, timeSlot);

    if (appointment) {
      const startTime = moment(appointment.appointmentSlot.startTime, 'HH:mm');
      const endTime = moment(appointment.appointmentSlot.endTime, 'HH:mm');
      // compare timeslot and startTime
      if (timeSlot === appointment.appointmentSlot.startTime) {
        const duration = endTime.diff(startTime, 'minutes');
        return duration / this.leastDuration; // Assuming a time slot interval of 30 minutes
      }
    }

    // Return a default rowspan of 1 for times when no appointment or availability is found
    return 0;
  }

  private initializeSlotCache(inputArray: any[]): void {
    inputArray.forEach((item) => {
      item.days.forEach((day: any) => {
        day.slots.forEach((slot: any) => {
          const doctorId: any = `doctor_${item.doctor}`;
          const roomId: any = `room_${item.room}`;
          if (!this.slotCache.has(doctorId)) {
            this.slotCache.set(doctorId, []);
          }
          if (!this.slotCache.has(roomId)) {
            this.slotCache.set(roomId, []);
          }
          if (!slot.slotsduration) {
            return;
          }
          this.slotCache.get(doctorId)!.push(
            ...slot.slotsduration.map((o: any) => ({
              date: day.date,
              id: item.id,
              doctor: item.doctor,
              from: item.from,
              to: item.to,
              room: item.room,
              duration: item.duration,
              slot: {
                startTime: o.startTime,
                endTime: o.endTime,
              },
              clinic_id: item.clinic_id,
              admin: item.admin,
              is_deleted: item.is_deleted,
              created_at: item.created_at,
              updated_at: item.updated_at,
              room_name: item.room_name,
              doctor_name: item.doctor_name,
            }))
          );
          this.slotCache.get(roomId)!.push(
            ...slot.slotsduration.map((o: any) => ({
              date: day.date,
              id: item.id,
              doctor: item.doctor,
              from: item.from,
              to: item.to,
              room: item.room,
              duration: item.duration,
              slot: {
                startTime: o.startTime,
                endTime: o.endTime,
              },
              clinic_id: item.clinic_id,
              admin: item.admin,
              is_deleted: item.is_deleted,
              created_at: item.created_at,
              updated_at: item.updated_at,
              room_name: item.room_name,
              doctor_name: item.doctor_name,
            }))
          );
        });
      });
    });
  }

  isSlotAvailable(id: number, timeSlot: string): boolean {
    const doctorKey: any = `doctor_${id}`;
    const roomKey: any = `room_${id}`;
    if (this.groupByKey === 'doctor' && this.slotCache.get(doctorKey)) {
      return this.slotCache
        .get(doctorKey)!
        .some((slot) => this.isSlotMatching(slot, timeSlot));
    } else if (this.groupByKey === 'room' && this.slotCache.get(roomKey)) {
      return this.slotCache
        .get(roomKey)!
        .some((slot) => this.isSlotMatching(slot, timeSlot));
    }
    return false;
  }

  private isSlotMatching(slot: any, timeSlot: string): boolean {
    const startTimeMoment = moment(slot.slot.startTime, 'HH:mm');
    const endTimeMoment = moment(slot.slot.endTime, 'HH:mm');
    const timeSlotMoment = moment(timeSlot, 'HH:mm');
    return (
      timeSlotMoment.isBetween(startTimeMoment, endTimeMoment, null, '[]') &&
      !timeSlotMoment.isSame(endTimeMoment)
    );
  }

  generateSlots(inputArray: any[]): any[] {
    return inputArray.flatMap((item) =>
      item.days.flatMap((day: any) =>
        day.slots.flatMap((slot: any) =>
          slot.slotsduration.map((o: any) => ({
            date: day.date,
            id: item.id,
            doctor: item.doctor,
            from: item.from,
            to: item.to,
            room: item.room,
            duration: item.duration,
            slot: {
              startTime: o.startTime,
              endTime: o.endTime,
            },
            clinic_id: item.clinic_id,
            admin: item.admin,
            is_deleted: item.is_deleted,
            created_at: item.created_at,
            updated_at: item.updated_at,
            room_name: item.room_name,
            doctor_name: item.doctor_name,
          }))
        )
      )
    );
  }

  switchAppointment(groupByKey: string) {
    this.groupByKey = groupByKey;
    if (groupByKey === 'doctor') {
      this.tableHeaders = this.doctorList;
      this.specialityList = this.doctorList;
    } else {
      this.tableHeaders = this.rooms;
      this.roomsList = this.rooms;
    }
  }

  hasAppointment(doctorId: number, timeSlot: string) {
    const appointment = this.isAppointmentScheduled(doctorId, timeSlot);
    return appointment && this.getAppointmentRowspan(doctorId, timeSlot)
      ? true
      : false;
  }

  hasSlotAvailable(doctorId: number, timeSlot: string) {
    return (
      !this.isAppointmentScheduled(doctorId, timeSlot) &&
      this.isSlotAvailable(doctorId, timeSlot)
    );
  }

  hasNoSlotAvailable(doctorId: number, timeSlot: string) {
    return (
      !this.isSlotAvailable(doctorId, timeSlot) &&
      !this.isAppointmentScheduled(doctorId, timeSlot)
    );
  }
}
