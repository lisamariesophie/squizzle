import { Component, OnInit } from '@angular/core';
import { Question } from '../_models/question.model';
import { Topic } from '../_models/topic.model';
import { FormArray, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { TopicsService } from '../_services/topics.service';
import { ActivatedRoute } from '@angular/router';
import { TopicsDatabaseService } from '../_services/topics-database.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { GapText } from '../_models/gaptext.model';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

  topic: Topic;
  topicId: string;
  form: FormGroup;
  gapTexts: GapText[];

  constructor(private route: ActivatedRoute,
    private topicsService: TopicsDatabaseService, private formBuilder: FormBuilder, private afAuth: AngularFireAuth) { }

  ngOnInit(): void {
    this.topicId = this.route.snapshot.paramMap.get('id');
    this.getTopic();
    this.createForm();
  }

  private createForm() {
    this.form = this.formBuilder.group({
      userAnswers: this.formBuilder.array([this.formBuilder.group({
        userAnswer: ['', [Validators.required]],
        userGaps: this.formBuilder.array([])
      })])
    });
  }

  get formControls() { return this.form.controls; }

  get userAnswers() {
    return this.form.get('userAnswers') as FormArray;
  }

  get userGaps() {
    return this.userAnswers.get('userGaps') as FormArray;
  }

  getTopic() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        const userId = user.uid;
        this.topicsService.getTopic(userId, this.topicId).subscribe(singleDoc => {
          this.topic = singleDoc;
        });
      }
    });
  }

  getQuestionType(question: Question) {
    if (question.type == 1 || question.type == 2 || question.type == 4) {
      return "Multiple Choice";
    }
    else if (question.type == 3) {
      return "Evaluation";
    }
    else if (question.type == 4) {
      return "Lückentext";
    }
    else if (question.type == 5) {
      return "Freitext";
    }
    else if (question.type == 6) {
      return "Lückentext";
    }
    else {
      return "Single Choice";
    }
  }

  showHint(i: number, question: Question) {
    const hintDiv = document.getElementById(`hint${i}`);
    const hintBtn = document.getElementById(`hintBtn${i}`);
    hintBtn.hidden = true;
    const hintText = document.createTextNode("Hinweis: " + question.hint);
    this.topic.quiz.questions[i].points -= 1;
    hintDiv.appendChild(hintText);
    // this.topicsService.updateTopic(this.topicId, this.topic);
  }

  submitQuiz() {

  }

}
