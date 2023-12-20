import { Component, OnInit, ViewChild } from "@angular/core";
import * as moment from "moment";
import { InventoryService } from "src/app/services/inventory.service";
import { NotificationService } from "src/app/services/notification.service";
import { WorkBook, WorkSheet, utils, writeFile } from "xlsx";

@Component({
    selector: 'medication-material',
    templateUrl: './medication-material.component.html',
    styleUrls: ['./medication-material.component.scss'],
  })
  export class MedicationMaterialComponent implements OnInit {
    asideState: any = {
      hidden: true,
    };
    inventoryList: any = [];
    moment: any = moment();
    page: number = 1;
    showLoader: boolean = false;
    viewAside: any = {
      hidden: true,
      material: {},
    };
    restockAside: any = {
      hidden: true,
      material: {},
    };
    @ViewChild('fileInput') fileInput: any;
    searchText: string = '';
    sortBy: string = '';
    constructor(private inventoryService: InventoryService, private notification: NotificationService) {
    }
    ngOnInit(): void {
      this.getMaterials();
    }
    
    showAside() {
      this.asideState = {
        hidden: false,
      };
    }

    getMaterials() {
      this.showLoader = true;
      this.inventoryService.getMaterialList().subscribe(
        (response: any) => {
          this.inventoryList = response.material;
          this.showLoader = false;
        },
        (error) => {
          this.notification.error('Error while fetching materials');
          this.showLoader = false;
        }
      );
    }

    onViewMaterial(material: any) {
      this.viewAside = {
        hidden: false,
        material,
      };
    }

    restockMaterial(material: any) {
      this.restockAside = {
        hidden: false,
        material,
      };
    }

    onRestockSuccess() {
      this.getMaterials();
    }

    exportToExcel(): void {
      const sheetToDownload = this.inventoryList.map((item: any) => {
        return {
          'Código': item.code,
          'Descripción': item.description,
          'Centro de distribución': item.description_center,
          'Lote': item.batch,
          'Almacén': item.warehouse,
          'Tipo de material': item.material_type,
          'Ubicación': item.location,
          'Stock disponible': item.available_stock,
          'Unidad de medida': item.unit_of_measure,
          'Fecha de entrada al almacén': item.entry_date_warehouse,
          'Fecha de Caducidad': item.expiry_date,
          'Costo': item.cost,
          'Precio Público': item.public_price,
        };
      });
      const ws: WorkSheet = utils.json_to_sheet(sheetToDownload);
      const wb: WorkBook = utils.book_new();
      utils.book_append_sheet(wb, ws, 'Sheet1');
      writeFile(wb, `MedicamentosYMaterialDeCuración.xlsx`);
    }

    onFileSelected(event: any): void {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'material');
        this.inventoryService.uploadMaterial(formData).subscribe(
          (response: any) => {
            this.notification.success('El archivo ha subido correctamente');
            this.getMaterials();
          }, (error) => {
            this.notification.error('Error al subir el archivo');
          }

        );
    
      }
      this.fileInput.nativeElement.value = '';
    }

    importFile(): void {
      this.fileInput.nativeElement.click();
    }

    
  get sortedRecords(): any[] {
    return this.inventoryList.sort((a: any, b: any) => {
      const valueA = this.getPropertyValue(a, this.sortBy);
      const valueB = this.getPropertyValue(b, this.sortBy);
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueA.localeCompare(valueB);
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        return valueA - valueB;
      } else if (this.isDate(valueA) && this.isDate(valueB)) {
        const dateA = new Date(valueA);
        const dateB = new Date(valueB);
        return dateA.getTime() - dateB.getTime();
      } else {
        return 0; 
      }
    });
  }

  isDate(value: any): boolean {
  return !isNaN(Date.parse(value));
}

  getPropertyValue(obj: any, propertyPath: string): any {
    const parts = propertyPath.split('.');
    let value = obj;
  
    for (const part of parts) {
      if (value && value.hasOwnProperty(part)) {
        value = value[part];
      } else {
        value = null;
        break;
      }
    }
  
    return value;
  }

  get filteredRecords(): any[] {
    if (!this.searchText) {
      return this.sortedRecords;
    }
    return this.sortedRecords.filter(record =>
      record.code.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
  deleteMaterial(id: any) {
    this.notification.confirmDialog().then((result) => {
      if (result.isConfirmed) {
        this.inventoryService.deleteMaterial(id).subscribe(
          (response: any) => {
            this.notification.success('Eliminado con éxito');
            this.getMaterials();
          },
          (error: any) => {
            this.notification.error('Error al eliminar');
          }
        );
      }
    });
  }

  onMaterialSuccess() {
    this.getMaterials();
  }
}