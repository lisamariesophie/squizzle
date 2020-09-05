import { Component, OnInit, Input } from '@angular/core';
import { Question, Answer } from '../_models/question.model';
import { Topic } from '../_models/topic.model';
import { FormArray, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TopicsDatabaseService } from '../_services/topics-database.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { GapText } from '../_models/gaptext.model';
import { UsersService } from '../_services/users.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})

export class QuizComponent implements OnInit {
  @Input() user: any;
  @Input() preview: boolean;


  topic: Topic;
  topicId: string;
  form: FormGroup;
  gapTexts: GapText[];

  constructor(private route: ActivatedRoute,
    private topicsService: TopicsDatabaseService, private userService: UsersService, private fb: FormBuilder, private afAuth: AngularFireAuth) { }

  ngOnInit(): void {
    this.topicId = this.route.snapshot.paramMap.get('id');
    this.getTopic();
    this.createForm();
  }

  private createForm() {
    this.form = this.fb.group({
      questionsArray: this.fb.array([])
    });
  }

  get formControls() { return this.form.controls; }

  get questionsArray() {
    return this.form.get('questionsArray') as FormArray;
  }

  get answersArray() {
    return this.questionsArray.get('answersArray') as FormArray;
  }


  getTopic() {
    this.afAuth.authState.subscribe(user => {
      this.userService.getUser(user.uid).pipe(take(1)).subscribe(res => {
        this.user = res;
        //check if User is admin
        if (this.user.roles.admin == true) {
          this.preview = true;
          this.topicsService.getTopic(this.topicId).pipe(take(1)).subscribe(res => {
            this.topic = res;
          });
        }
        else {
          this.topicsService.getUserTopic(this.user.uid, this.topicId).pipe(take(1)).subscribe(res => {
            this.topic = res;
            if(res){
              for (let question of this.topic.quiz.questions) {
                this.addQuestion(question);
              }
            } else {
              this.topicsService.createUserTopic(user.uid, this.topicId, topic); //if already logged in
            }
            
          })
        }
      })
    })
  }

  private addQuestion(question: any) {
      let group = this.fb.group({
        'name': [question ? question.name : ''],
        'answersArray': this.fb.array([])
      });
    (<FormArray>this.form.get('questionsArray')).push(group);
    let qIndex = (<FormArray>this.form.get('questionsArray')).length - 1;
    question.answers.forEach(a => {
      this.addAnswer(qIndex, a);
    });
  }

  private addAnswer(qIndex: number, data: any) {
    let group = this.fb.group({
      'answer': new FormControl(false)
    });
    (<FormArray>(<FormGroup>(<FormArray>this.form.controls['questionsArray'])
      .controls[qIndex]).controls['answersArray']).push(group);
  }

  get maxScore() {
    let maxScore = 0;
    for (let question of this.topic.quiz.questions) {
      maxScore += question.points;
    }
    return maxScore;
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

  showHint(i: number) {
    this.topic.quiz.questions[i].points -= 1;
    this.topic.quiz.questions[i].hintOpened = true;
    this.topicsService.updateUserTopic(this.user.uid, this.topicId, this.topic);
  }

  submitQuiz() {
    this.topic.quiz.submitted = true;
    this.topic.quiz.score = this.getScore();
    this.topicsService.updateUserTopic(this.user.uid, this.topicId, this.topic);
  }

  getScore() {
    const answeredQuestions: Array<any> = this.form.value.questionsArray;
    const questions: Array<Question> = this.topic.quiz.questions;
    let score = 0;
    for (let i = 0; i < questions.length; i++) {
      let correct = 0;
      // Loop Fragen
      for (let j = 0; j < questions[i].answers.length; j++) {
        // Loop Antworten für Fragen
        if (questions[i].answers[j].correct == answeredQuestions[i].answersArray[j].answer) {
          correct += 1;
        }
        if (correct == questions[i].answers.length) {
          score += questions[i].points;
        }
      }
    }
    return score;
  }
}
