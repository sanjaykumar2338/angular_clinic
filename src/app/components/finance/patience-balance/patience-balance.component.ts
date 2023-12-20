import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PatienceBalanceService } from 'src/app/services/patience-balance.service';
import { WorkBook, WorkSheet, utils, writeFile } from 'xlsx';

@Component({
  selector: 'patience-balance',
  templateUrl: './patience-balance.component.html',
  styleUrls: ['./patience-balance.component.css'],
})
export class PatienceBalanceComponent implements OnInit {
  patientList : any[] = [];
  showLoader: boolean = false;
  sortBy: string = '';
  searchText: string = '';
  page: number = 1;
  constructor(private route: Router, private patientService: PatienceBalanceService) {}

  ngOnInit(): void {
    this.getPatientList();
  }

  showSinglePatient(id: number) {
    this.route.navigate(['finance/patient-detail', id]);
  }

  getPatientList() {
    this.showLoader = true;
    this.patientService.getPatientList().subscribe((res: any) => {
      this.patientList = res.patientbalance;
      this.showLoader = false;
    });
  }

  exportToExcel(): void {
    const sheetToDownload = this.patientList.map((item: any) => {
      return {
        'Expediente': item.file,
        'Paciente':item.name,
        'Médico Tratante' :item.doctor,
        'Importe': item.total_amount,
        'Pagado': item.paid_amount,
        'Pendiente': item.pending_amount,
      };
    });
    const shortenSheetName = this.patientList[0].name.substring(0, 31);
    const ws: WorkSheet = utils.json_to_sheet(sheetToDownload);
    const wb: WorkBook = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Sheet1');
    writeFile(wb, `patience-list.xlsx`);
  }


  get sortedRecords(): any[] {
    return this.patientList.sort((a, b) => {
      const valueA = this.getPropertyValue(a, this.sortBy);
      const valueB = this.getPropertyValue(b, this.sortBy);
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueA.localeCompare(valueB);
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        return valueA - valueB;
      } else {
        return 0; 
      }
    });
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
      record.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
  
}
