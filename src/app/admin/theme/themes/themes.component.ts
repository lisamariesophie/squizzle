import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AddThemeComponent } from '../add-theme/add-theme.component';
import { Topic } from 'src/app/models/topic';
import { TopicsService } from 'src/app/services/topics.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-themes',
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.scss']
})
export class ThemesComponent implements OnInit {
  closeResult: string;
  topics: Topic[];

  constructor(
    private modalService: NgbModal, private topicsService: TopicsService, public router: Router) { }

  ngOnInit() {
    console.log('LOCALSTORAGE', localStorage);
    this.topics = this.topicsService.getTopics();
  }

  openFormModal() {
    const modalRef = this.modalService.open(AddThemeComponent, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static' });
    modalRef.componentInstance.id = 10; // should be the id
    modalRef.result.then((result) => {
    }).catch((error) => {
    });
  }


  deleteTopic(topic) {
    for (let i = 0; i < this.topics.length; i++) {
      if (this.topics[i].name == topic.name) {
        this.topics.splice(i, 1);
      }
    }
    this.topicsService.deleteTopic(topic);
  }

  get topicArray() {
    return this.topics;
  }

}
