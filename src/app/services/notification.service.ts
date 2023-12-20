import { Injectable } from '@angular/core';
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  success(message: string) {
    Swal.fire({text: message, icon:'success', timer: 1500});
  }
  warning(message: string) {
    Swal.fire( {text: message, icon: 'warning', timer: 1500});
  }
  error(message: string) {
    Swal.fire( {text: message, icon: 'error',  timer: 1500})
  }

  confirmDialog() {
    return Swal.fire({
      text: '¿Estás seguro que quieres borrarlo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    });
  }

}
