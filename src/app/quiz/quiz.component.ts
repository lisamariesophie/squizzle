import { Component, OnInit } from '@angular/core';
import { Question, Answer } from '../_models/question.model';
import { Topic } from '../_models/topic.model';
import { FormArray, Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { TopicsService } from '../_services/topics.service';
import { ActivatedRoute } from '@angular/router';
import { TopicsDatabaseService } from '../_services/topics-database.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { GapText } from '../_models/gaptext.model';
import { User } from '../_models/user';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

  user: any;
  topic: Topic;
  topicId: string;
  form: FormGroup;
  gapTexts: GapText[];

  constructor(private route: ActivatedRoute,
    private topicsService: TopicsDatabaseService, private fb: FormBuilder, private afAuth: AngularFireAuth) { }

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

  // createquestionArray() {
  //   return this.formBuilder.group({
  //     answersArray: new FormArray([
  //       this.createAnswersArray()
  //     ])
  //   });
  // }

  // createAnswersArray() {
  //   return this.formBuilder.group({
  //     answer: new FormArray([
  //     ])
  //   });
  // }

  get formControls() { return this.form.controls; }

  get questionsArray() {
    return this.form.get('questionsArray') as FormArray;
  }

  get answersArray() {
    return this.questionsArray.get('answersArray') as FormArray;
  }

  // get userGaps() {
  //   return this.userAnswers.get('userGaps') as FormArray;
  // }


  getTopic() {
    this.afAuth.authState.subscribe(user => {
      this.user = user;
      if (this.user.roles == "admin") {
        this.topicsService.getTopic(this.topicId).subscribe(res => {
          this.topic = res;
        });
      }
      else {
        this.topicsService.getUserTopic(this.user.uid, this.topicId).subscribe(res => {
          this.topic = res;
          for (let question of this.topic.quiz.questions) {
            this.addQuestion(question);

          }
        })
      }
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
    // console.log('qIndex', qIndex, '-------', 'data', data);
    let group = this.fb.group({
      'answer': new FormControl(false)
    });
    (<FormArray>(<FormGroup>(<FormArray>this.form.controls['questionsArray'])
      .controls[qIndex]).controls['answersArray']).push(group);
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
    // console.log('AnsweredQuestions', answeredQuestions)
    // console.log('Questions', questions)
    let score = 0;

    for (let i = 0; i < questions.length; i++) {
      let correct = 0;
      // Loop Fragen
      for (let j = 0; j < questions[i].answers.length; j++) {
        // Loop Antworten für Fragen
        if (questions[i].answers[j].correct == answeredQuestions[i].answersArray[j].answer) {
          correct += 1;
        }
        if(correct == questions[i].answers.length) {
          score += questions[i].points;
        }
      }
    }
    return score;
  }
}
