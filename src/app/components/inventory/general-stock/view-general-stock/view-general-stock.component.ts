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
  selector: 'view-general-stock',
  templateUrl: './view-general-stock.component.html',
  styleUrls: ['./view-general-stock.component.css'],
})
export class ViewGeneralStockComponent implements OnInit, OnChanges {
  @Input() viewAside: any = {
    hidden: true,
    material: {}
  };
  @Input() material: any = {};
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