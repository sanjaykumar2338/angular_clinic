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
import { InventoryService } from 'src/app/services/inventory.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'add-general-stock',
  templateUrl: './add-general-stock.component.html',
  styleUrls: ['./add-general-stock.component.css'],
})
export class AddGeneralStockComponent implements OnInit, OnChanges {
  @Input() asideState: any = {
    hidden: true,
  };
  @Output() onInventorySuccess: EventEmitter<any> = new EventEmitter();
  inventoryForm: any = new FormGroup({}) as any;
  datePickerOptions: any = {
    singleDatePicker: true,
    showDropdowns: true,
    minYear: 1901,
    autoApply: true,
    locale: {
      format: 'YYYY-MM-DD',
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
      ]
    },
    autoUpdateInput: false,
  };
  
  constructor(
    private fb: FormBuilder,
    private notification: NotificationService,
    private inventoryService: InventoryService
  ) {
    this.initInventoryForm();
  }

  ngOnInit() {}

  initInventoryForm() {
    this.inventoryForm = this.fb.group({
      code: ['', Validators.required],
      description: ['', Validators.required],
      description_center: ['', Validators.required],
      batch: ['', Validators.required],
      warehouse: ['', Validators.required],
      material_type: ['', Validators.required],
      location: ['', Validators.required],
      available_stock: ['', Validators.required],
      unit_of_measure: ['', Validators.required],
      entry_date_warehouse: ['', Validators.required],
      // expiry_date: ['', Validators.required],
      cost: ['', Validators.required],
      public_price: ['', Validators.required],
      stock_type: ['general', Validators.required],
    });
  }
  ngOnChanges(changes: SimpleChanges) {
  }


  closeAside() {
    this.initInventoryForm();
    this.asideState = {
      hidden: true,
    };
  }


  onSubmit() {
    if(this.inventoryForm.invalid) {
      this.inventoryForm.markAllAsTouched();
      this.notification.error('Por favor llene todos los campos requeridos');
      return;
    }
    this.inventoryService.addNewGeneralStock(this.inventoryForm.value).subscribe(
      (res) => {
        this.notification.success('Agregado exitosamente');
        this.onInventorySuccess.emit();
        this.closeAside();
      },
      (err) => {
        //console.log(err.error.message)
        this.notification.error(err.error.message);
        //this.notification.error('Error al agregar');
      }
    );
  }


  selectedWarehouseDate(value: any) {
    this.inventoryForm.patchValue({
      entry_date_warehouse: value.start.format('YYYY-MM-DD'),
    });
    this.datePickerOptions.autoUpdateInput = true;
  }
}
