import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NotificationService } from "src/app/services/notification.service";
import { PatienceBalanceService } from "src/app/services/patience-balance.service";


@Component({
    selector: 'patient-document',
    templateUrl: './patient-document.component.html',
    styleUrls: ['./patient-document.component.scss'],
  })
  
export class DocumentComponent implements OnInit {
  @ViewChild('fileInput1') fileInput1: ElementRef;
  @ViewChild('fileInput2') fileInput2: ElementRef;
  @ViewChild('fileInput3') fileInput3: ElementRef;
  @ViewChild('fileInput4') fileInput4: ElementRef;
  public formData = new FormData();
  patientId: any;
  showLoader: boolean = false;
  documentList: any[] = [];
  page: number = 1;
    constructor(private route: ActivatedRoute, private patienceBalanceService: PatienceBalanceService, 
      private notificationService: NotificationService) {
      this.route.params.subscribe((params) => {
        this.patientId = params['id'];
        this.showLoader = true;
        this.getDocumentList();
      });
    }

    ngOnInit(): void {   
    }

    getDocumentList() {
      this.patienceBalanceService.getDocument(this.patientId).subscribe((res: any) => {
        this.documentList = res.data.documents;
        this.showLoader = false;
      });
    }


    onFileSelected(event: any, fileInputRef: HTMLInputElement) {
      const selectedFile = event.target.files[0] as File;
      if (selectedFile) {
        this.saveFile(selectedFile, fileInputRef);
      }
    }

    saveFile(selectedFile: any, fileInput: HTMLInputElement) {  
      const fileName = fileInput.name;
      this.formData.append('document', selectedFile);
      switch (fileName) {
        case "fileInput1":
          this.formData.append('type', 'Identificación oficial');
          this.fileInput1.nativeElement.value = '';
          break;
        case "fileInput2":
          this.formData.append('type', 'Constanica SAT');
          this.fileInput2.nativeElement.value = '';
          break;
        case "fileInput3":
          this.formData.append('type', 'Comprobante de domicilio');
          this.fileInput3.nativeElement.value = '';
          break;
        case "fileInput4":
          this.formData.append('type', 'Póliza de seguro');
          this.fileInput4.nativeElement.value = '';
          break;
      }
      this.saveDocument();
    }

    saveDocument() {
      this.patienceBalanceService.saveDocument(this.patientId, this.formData).subscribe((res: any) => {
        this.notificationService.success('Documento guardado correctamente');
        this.getDocumentList();
        this.formData = new FormData();
      });
    }

    downloadDocument(obj: any) {
      this.patienceBalanceService.downloadDocument(obj.id).subscribe((res: any) => {
        const blob = new Blob([res], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = obj.document.split('/').pop(); 
      document.body.appendChild(a);

      a.click();

      window.URL.revokeObjectURL(url);

      }, (err) => {
        this.notificationService.error('No se pudo descargar el documento');
      });
    }

    deleteDocument(id: any) {
      this.notificationService.confirmDialog().then((result) => {
        if (result.isConfirmed) {
          this.patienceBalanceService.deleteDocument(id).subscribe((res: any) => {
            this.notificationService.success('Documento eliminado correctamente');
            this.getDocumentList();
          }, (error: any) => {
            this.notificationService.error('Error al eliminar el documento');
          });
        }});
    }

    openFileInput(fileInput: HTMLInputElement) {
      fileInput.click();
    }
}