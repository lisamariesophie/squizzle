import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Topic } from 'src/app/_models/topic.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateTopicComponent } from './create-topic/create-topic.component';
import { TopicsDatabaseService } from 'src/app/_services/topics-database.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ConnectionService } from 'src/app/_services/connection.service';
import { TopicsService } from 'src/app/_services/topics.service';
import { ToastService } from 'src/app/_services/toast.service';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements OnInit {

  closeResult: string;
  topics: Topic[];

  constructor(
    private toast: ToastService, private modalService: NgbModal, private localTopics: TopicsService, private topicsService: TopicsDatabaseService, public router: Router, private authService: AuthenticationService, public connectionService: ConnectionService) { }

  ngOnInit() {
    this.getTopics();
  }

  getTopics() {
    if (this.connectionService.isOnline) {
      this.checkIfLocalTopics();
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
    else {
      this.topics = this.localTopics.getTopics();
    }
  }

  deleteTopic(id: string) {
    if (confirm('Quiz wirklich löschen?')) {
      if (this.connectionService.isOnline) {
        this.topicsService.deleteTopic(id);
      }
      else {
        this.localTopics.deleteTopic(id);
      }
    }
  }

  openCreateTopic() {
    const modalRef = this.modalService.open(CreateTopicComponent, { backdrop: 'static' });
    modalRef.result.then((result) => {
    })
  }

  private checkIfLocalTopics() {
    const localTopics = this.localTopics.getTopics();
    if (localTopics != null && localTopics.length > 0) {
      this.addTopicsToDatabase();
    }
  } 

  private addTopicsToDatabase() {
    this.authService.user.subscribe(user => {
      const topics = this.localTopics.getTopics();
      if (user) {
        for (let topic of topics) {
          topic.authorUID = user.uid;
          this.topicsService.createTopic(topic).then(res => {
            this.toast.showSuccess("Thema hinzugefügt");
            this.localTopics.deleteTopic(topic.id);
          }).catch(err => {
            this.toast.showError("Thema konnte nicht hinzugefügt werden: " + err);
          });;
        }
      }
    });
  }


}
