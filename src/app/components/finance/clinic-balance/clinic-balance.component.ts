import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'clinic-balance',
  templateUrl: './clinic-balance.component.html',
  styleUrls: ['./clinic-balance.component.css'],
})
export class ClinicBalanceComponent implements OnInit {
  currentTab = 0;
  constructor() {}

  ngOnInit(): void {}

  changeTab(tabIndex: number) {
    this.currentTab = tabIndex;
  }
}
