import { Component, OnInit, OnChanges } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AddThemeComponent } from '../add-theme/add-theme.component';
import { Topic } from 'src/app/models/topic';
import { TopicsService } from 'src/app/services/topics.service';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-themes',
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.scss']
})
export class ThemesComponent implements OnInit{
  closeResult: string;
  topics: Topic[];

  constructor(
    private modalService: NgbModal, private topicsService: TopicsService, public router: Router, private localSt:LocalStorageService) {
      this.topics = this.topicsService.getTopics();
     }

  ngOnInit() {
    this.topics = this.topicsService.getTopics();
  }

  openFormModal() {
    const modalRef = this.modalService.open(AddThemeComponent, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static' });
    // modalRef.componentInstance.id = 10; 
    modalRef.result.then((result) => {
    }).catch((error) => {
    });
  }


  deleteTopic(id: string) {
    if (confirm('Thema löschen?')) {
      this.topicsService.deleteTopic(id);
    }
  }

  get topicArray() {
    return this.topics;
  }

}
