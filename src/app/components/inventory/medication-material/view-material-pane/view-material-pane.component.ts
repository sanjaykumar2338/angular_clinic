import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'view-material-pane',
  templateUrl: './view-material-pane.component.html',
  styleUrls: ['./view-material-pane.component.css'],
})
export class ViewMaterialComponent implements OnInit, OnChanges {
  @Input() viewAside: any = {
    hidden: true,
    material: {}
  };
  @Output() onBack: EventEmitter<any> = new EventEmitter();
  
  constructor(
  ) {
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
  }


  closeAside() {
    this.viewAside = {
      hidden: true,
      material: {}
    };
    this.onBack.emit()
  }
}