import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AddThemeComponent } from '../add-theme/add-theme.component';

@Component({
  selector: 'app-themes',
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.scss']
})
export class ThemesComponent implements OnInit {
  closeResult: string;

  constructor(
    private modalService: NgbModal) { }

  ngOnInit() { }

  openFormModal() {
    const modalRef = this.modalService.open(AddThemeComponent, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    });
  }

}
