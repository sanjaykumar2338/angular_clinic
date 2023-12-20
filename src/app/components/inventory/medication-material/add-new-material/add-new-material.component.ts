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
  selector: 'add-new-material',
  templateUrl: './add-new-material.component.html',
  styleUrls: ['./add-new-material.component.css'],
})
export class AddNewMaterialComponent implements OnInit, OnChanges {
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
      ],
    },
    autoUpdateInput: false,

  };
  datePickerOptions2: any = {
    ...this.datePickerOptions,
    autoUpdateInput: false,
  }
  
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
      entry_date_warehouse: [moment().format('YYYY-MM-DD'), Validators.required],
      expiry_date: [moment().format('YYYY-MM-DD'), Validators.required],
      cost: ['', Validators.required],
      public_price: ['', Validators.required],
      stock_type: ['material', Validators.required],
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
      this.notification.error('Por favor complete todos los campos requeridos');
      return;
    }
    this.inventoryService.addNewMaterial(this.inventoryForm.value).subscribe(
      (res) => {
        this.notification.success('Material agregado exitosamente');
        this.onInventorySuccess.emit();
        this.closeAside();
      },
      (err) => {
        //this.notification.error('Error al agregar');
        //this.notification.error(err.error?.message?.code[0]);
        this.notification.error(err.error.message);
      }
    );
  }

  selectedExpiryDate(value: any) {
    this.inventoryForm.patchValue({
      expiry_date: value.start.format('YYYY-MM-DD'),
    });
    this.datePickerOptions2.autoUpdateInput = true;
  }

  selectedWarehouseDate(value: any) {
    this.inventoryForm.patchValue({
      entry_date_warehouse: value.start.format('YYYY-MM-DD'),
    });
    this.datePickerOptions.autoUpdateInput = true;

  }
}
