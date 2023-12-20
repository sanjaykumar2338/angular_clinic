import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
})
export class ConfigurationComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {}

  redirectToRooms() {
    this.router.navigate(['rooms'], { relativeTo: this.route });
  }

  redirectToCreateSchedule() {
    this.router.navigate(['create-schedule'], { relativeTo: this.route });
  }
}
