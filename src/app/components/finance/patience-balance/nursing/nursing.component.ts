import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { NotificationService } from 'src/app/services/notification.service';
import { NursingService } from 'src/app/services/nursing.service';

@Component({
  selector: 'nursing',
  templateUrl: './nursing.component.html',
  styleUrls: ['./nursing.component.scss'],
})
export class NursingComponent implements OnInit {
  asideState: any = {
    hidden: true,
  };
  nurseList: any = [];
  selectedNurse: any = null;
  showLoader: boolean = false;
  p = 1;
  imagePath: any = null; 
  constructor(
    private nursingSvc: NursingService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.getNurses();
  }

  showAside() {
    this.selectedNurse = null;
    this.asideState = {
      hidden: false,
    };
  }

  getNurses() {
    this.showLoader = true;
    this.nursingSvc.getNurse().subscribe((res) => {
      this.imagePath = `${res.image_path}/`;
      this.nurseList = res.nurse;
      this.showLoader = false;
    });
  }

  editNurse(nurse: any) {
    this.selectedNurse = _.cloneDeep(nurse);
    this.asideState = {
      hidden: false,
    };
  }

  trackByFn(index: number): any {
    return index;
  }

  onSuccess(ev: any) {
    this.getNurses();
  }
}
