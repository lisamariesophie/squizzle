import { Component, OnInit } from '@angular/core';
import { TopicsService } from 'src/app/_services/topics.service';
import { Router } from '@angular/router';
import { Topic } from 'src/app/_models/topic.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateTopicComponent } from './create-topic/create-topic.component';
import { TopicsDatabaseService } from 'src/app/_services/topics-database.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements OnInit {

  closeResult: string;
  topics: Topic[];

  constructor(
    private modalService: NgbModal, private topicsService: TopicsDatabaseService, public router: Router, private afAuth: AngularFireAuth) {
  }

  ngOnInit() {
    this.getTopics();
  }

  getTopics() {
    this.afAuth.authState.subscribe(user => {
      if(user) {
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
    if (confirm('Thema löschen?')) {
      this.topicsService.deleteTopic(id);
    }
  }

  openFormModal() {
    const modalRef = this.modalService.open(CreateTopicComponent, { backdrop: 'static' });
    modalRef.result.then((result) => {
    }).catch((error) => {
    });
  }


}
