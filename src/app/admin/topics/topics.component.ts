import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Topic } from 'src/app/_models/topic.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateTopicComponent } from './create-topic/create-topic.component';
import { TopicsDatabaseService } from 'src/app/_services/topics-database.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements OnInit {

  closeResult: string;
  topics: Topic[];

  constructor(
    private modalService: NgbModal, private topicsService: TopicsDatabaseService, public router: Router, private authService: AuthenticationService) {
  }

  ngOnInit() {
    this.getTopics();
  }

  getTopics() {
    this.authService.user.subscribe(user => {
      if (user) {
        const userId = user.uid;
        this.topicsService.getTopics(userId).snapshotChanges().subscribe(response => {
          this.topics = response.map(document => {
            return {
              id: document.payload.doc.id,
              ...document.payload.doc.data() as {}
            } as Topic;
          })
        })
      }
    });
  }

  deleteTopic(id: string) {
    if (confirm('Quiz wirklich löschen?')) {
      this.topicsService.deleteTopic(id);
    }
  }

  openCreateTopic() {
    const modalRef = this.modalService.open(CreateTopicComponent, { backdrop: 'static' });
    modalRef.result.then((result) => {
    }).catch(error => {
    });
  }


}
