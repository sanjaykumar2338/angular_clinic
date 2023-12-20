import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { InventoryService } from 'src/app/services/inventory.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'restock-general-pane',
  templateUrl: './restock-pane.component.html',
  styleUrls: ['./restock-pane.component.css'],
})
export class GeneralRestockComponent implements OnInit, OnChanges {
  @Input() restockAside: any = {
    hidden: true,
    material: {}
  };
  @Output() onRestockSuccess: EventEmitter<any> = new EventEmitter();
  available_stock: any = 0;
  constructor(
    private inventoryService: InventoryService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
  }


  closeAside() {
    this.restockAside = {
      hidden: true,
      material: {}
    };
  }

  restockMaterial() {
    const newStock = this.restockAside.material.available_stock + Number(this.available_stock);
    this.inventoryService.generalReStock(this.restockAside.material.id, {available_stock: newStock}).subscribe(
      (response: any) => {
        this.notificationService.success('Actualizado con éxito');
        this.closeAside();
        this.onRestockSuccess.emit();
      },
      (error: any) => {
        this.notificationService.error('Error al actualizar');
      }
    );
  }
}