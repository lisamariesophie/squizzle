import { Component, OnInit } from '@angular/core';
import { QuestionCreateComponent } from '../question-create/question-create.component';
import { Topic } from 'src/app/_models/topic.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuestionSettingsComponent } from '../question-settings/question-settings.component';
import { TopicsDatabaseService } from 'src/app/_services/topics-database.service';
import { ToastService } from 'src/app/_services/toast.service';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { TopicUsersService } from 'src/app/_services/topicUsers.service';
import { UsersService } from 'src/app/_services/users.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent implements OnInit {

  topic: Topic;
  topicId: string;
  quizUrl: string;

  constructor(protected route: ActivatedRoute, public router: Router, protected topicsService: TopicsDatabaseService, protected topicUserService: TopicUsersService, protected userService: UsersService, protected authService: AuthenticationService, protected modalService: NgbModal, private storage: AngularFireStorage) {
  }

  ngOnInit(): void {
    this.topicId = this.route.snapshot.paramMap.get('id');
    this.quizUrl = `quizgenerator-6dc7c.firebaseapp.com/quizzes/quiz/${this.topicId}`
    this.getTopic();
  }

  getTopic() {
    this.topicsService.getTopic(this.topicId).subscribe(res => {
      this.topic = res;
    });
  }

  deleteQuestion(topic, question) {
    if (confirm('Frage löschen?')) {
      if (question.imgUrl != null) {
        this.deleteImgFromStorage(question.imgUrl);
      }
      for (let i = 0; i < topic.quiz.questions.length; i++) {
        if (topic.quiz.questions[i].id === question.id) {
          topic.quiz.questions.splice(i, 1);
        }
        this.authService.user.subscribe(user => {
          if (user) {
            const userId = user.uid;
            this.topicsService.updateTopic(userId, this.topicId, this.topic);
          }
        });
      }
    }
  }

  deleteImgFromStorage(imgUrl: string) {
    return this.storage.storage.refFromURL(imgUrl).delete();
  }

  setLive() {
    this.topic.live = !this.topic.live;
    this.authService.user.subscribe(user => {
      if (user) {
        const userId = user.uid;
        this.topicsService.updateTopic(userId, this.topicId, this.topic);
      }
    });
  }

  getMaxPoints() {
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
