import { Component, OnInit } from '@angular/core';
import { QuestionCreateComponent } from '../question-create/question-create.component';
import { Topic } from 'src/app/_models/topic.model';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuestionSettingsComponent } from '../question-settings/question-settings.component';
import { TopicsDatabaseService } from 'src/app/_services/topics-database.service';
import { ToastService } from 'src/app/_services/toast.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent implements OnInit {

  topic: Topic;
  topicId: string;
  quizUrl: string;

  constructor(private route: ActivatedRoute,
    private afAuth: AngularFireAuth, private topicsDatabase: TopicsDatabaseService, protected modalService: NgbModal, private toastr: ToastService) { }

  ngOnInit(): void {
    this.topicId = this.route.snapshot.paramMap.get('id');
    this.quizUrl = `quizgenerator-6dc7c.firebaseapp.com/quizzes/quiz/${this.topicId}`
    this.getTopic();
  }

  getTopic() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.topicsDatabase.getTopic(this.topicId).subscribe(singleDoc => {
          this.topic = singleDoc;
        });
      }
    });
  }

  deleteQuestion(topic, question) {
    if (confirm('Frage löschen?'))
      for (let i = 0; i < topic.quiz.questions.length; i++) {
        if (topic.quiz.questions[i].id === question.id) {
          topic.quiz.questions.splice(i, 1);
        }
        this.afAuth.authState.subscribe(user => {
          if (user) {
            const userId = user.uid;
            this.topicsDatabase.updateTopic(userId, this.topicId, this.topic);
          }
        });
      }
  }


  setLive() {
    this.topic.live = !this.topic.live;
    this.afAuth.authState.subscribe(user => {
      if (user) {
        const userId = user.uid;
        this.topicsDatabase.updateTopic(userId, this.topicId, this.topic);
      }
    });
  }

  getPoints() {
    let points = 0;
    if (this.topic == null) {
      return 0;
    }
    if (!this.topic.hasOwnProperty('quiz')) {
      return 0;
    }
    for (let question of this.topic.quiz.questions) {
      points += question.points;
    }
    return points;
  }

  openFormModal(topic: Topic) {
    const modalRef = this.modalService.open(QuestionCreateComponent, { ariaLabelledBy: 'create-question', backdrop: 'static', windowClass: "myCustomModalClass" });
    modalRef.componentInstance.topic = topic;
    console.log(topic)
    modalRef.componentInstance.id = this.topicId;
    modalRef.result.then((result) => {
    }).catch((error) => {
    });
  }

  openSettingsModal(id: string) {
    const modalRef = this.modalService.open(QuestionSettingsComponent, { ariaLabelledBy: 'quiz-settings', windowClass: "myCustomModalClass" });
    modalRef.componentInstance.topic = this.getTopic();
    modalRef.componentInstance.id = id;
    modalRef.result.then((result) => {
    }).catch((error) => {
    });
  }
}
