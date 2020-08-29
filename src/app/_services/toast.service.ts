import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastr: ToastrService) { }

  showSuccess(text: string) {
    this.toastr.success(text, 'Success');
  }

  showError(text: string) {
    this.toastr.error(text, 'Error');
  }
}