import { Component, OnInit, Input } from '@angular/core';
import { Question, Answer } from '../../_models/question.model';
import { Topic } from '../../_models/topic.model';
import { FormArray, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicsDatabaseService } from '../../_services/topics-database.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { GapText } from '../../_models/gaptext.model';
import { UsersService } from '../../_services/users.service';
import { take } from 'rxjs/operators';
import { TopicUsersService } from '../../_services/topicUsers.service';
import { ToastService } from 'src/app/_services/toast.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

  user: any;
  @Input() userId: string;
  topic: Topic;
  topicId: string;
  form: FormGroup;
  gapTexts: GapText[];
  preview: boolean = false;
  review: boolean = false;

  constructor(private route: ActivatedRoute,  private router: Router,
    private topicsService: TopicsDatabaseService, private userService: UsersService, private fb: FormBuilder, private afAuth: AngularFireAuth, private topicUserService: TopicUsersService, private toast: ToastService) { }

  ngOnInit(): void {
    this.topicId = this.route.snapshot.paramMap.get('id');
    this.checkUser();
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

  checkUser() {
    if (this.userId == undefined) {
      this.afAuth.authState.subscribe(user => {
        this.userService.getUser(user.uid).pipe(take(1)).subscribe(res => {
          this.user = res;
          // if User is admin -> preview
          if (this.user.roles.admin == true) {
            this.preview = true;
            this.getAdminTopic();
          }
          // If user -> Quiz
          else {
            this.getTopic(this.user.uid);
          }
        })
      })
      // if called from Scores Component -> Admin Quiz Review
    } else {
      this.review = true;
      this.getTopic(this.userId);
    }
  }

  // Get Topic from Admin by Id
  private getAdminTopic() {
    this.topicsService.getTopic(this.topicId).subscribe(res => {
      this.topic = res;
    });
  }

  private getTopic(userId) {
    this.topicsService.getUserTopic(userId, this.topicId).subscribe(userTopic => {
      // Add Quiz to CurrentUser if not already added
      if (!userTopic) {
        if (confirm("Neues Quiz hinzufügen?")) {
          // Get Topic by Id
          this.topicsService.getTopic(this.topicId).pipe(take(1)).subscribe(t => {
            let topic: any;
            topic = t;
            // Only add Quiz to current User if Quiz is live
            if (!topic.live) {
              this.toast.showError(`Das Quiz zu ${topic.name} ist noch nicht freigegeben!`);
              this.router.navigate(['/quizzes']);
              return;
            }
            // Add Topic to User, if Quiz live
            this.topicsService.createUserTopic(userId, this.topicId, topic);
            let topicUser;
            // Get UserId of CurrentUser 
            this.userService.getUser(userId).pipe(take(1)).subscribe(currentUser => {
              topicUser = {
                topicId: this.topicId,
                userId: currentUser.uid
              }
              // Create Connection between CurrentUser & Topic in Firestore 
              this.topicUserService.createTopicUser(topicUser);
              this.createQuestions();
              this.getTopic(userId);
            });
          });
        }
      }
      // if Quiz was already added to CurrentUser
      else {
        this.topic = userTopic;
        this.createQuestions();
      }
    })
  }

  // Add Questions to Form
  private createQuestions() {
    if (this.topic.quiz != null) {
      for (let question of this.topic.quiz.questions) {
        if (question.type == 5) {
          this.addTextQuestion(question);
        }
        // if (question.type == 6) {
        //   this.addGapQuestion(question);
        // }
        else {
          this.addMCQuestion(question);
        }
      }
    }
  }

  // Add a Multiple Choice Question or Evaluation
  private addMCQuestion(question: any) {
    let group = this.fb.group({
      'name': [question ? question.name : ''],
      'answersArray': this.fb.array([]),
    });
    (<FormArray>this.form.get('questionsArray')).push(group);
    let qIndex = (<FormArray>this.form.get('questionsArray')).length - 1;
    question.answers.forEach(a => {
      this.addAnswer(qIndex, a);
    });
  }

  // Add a Text Question to Form
  private addTextQuestion(question: any) {
    let group = this.fb.group({
      'name': [question ? question.name : ''],
      'textAnswer': '',
      'textAnswerCorrected': question.textAnswer,
      'userScore': ''
    });
    (<FormArray>this.form.get('questionsArray')).push(group);
  }

  // private addGapQuestion(question: any) {
  //   let group = this.fb.group({
  //     'name': [question ? question.name : ''],
  //     'answersArray': this.fb.array([]),
  //   });
  //   (<FormArray>this.form.get('questionsArray')).push(group);
  //   let qIndex = (<FormArray>this.form.get('questionsArray')).length - 1;
  //   const gaps = [];
  //   const text = [];
  //   console.log(question)
  //   const gaptext = question.gaptext;
  //   for (let item of Object.keys(gaptext)) {
  //     const i = question.gaptext[item];
  //     if (i.type == "text") {
  //       text.push(text);
  //     } else {
  //       gaps.push(text);
  //     }
  //   }
  //   console.log(gaps)
  //   question.gaps.forEach(a => {
  //     this.addAnswer(qIndex, a);
  //   });
  // }

  // Add a new answer to the answersArray
  private addAnswer(qIndex: number, data: any) {
    let group = this.fb.group({
      'answer': new FormControl(false),
    });
    (<FormArray>(<FormGroup>(<FormArray>this.form.controls['questionsArray'])
      .controls[qIndex]).controls['answersArray']).push(group);
  }

  showHint(i: number) {
    this.topic.quiz.questions[i].userScore -= 1; // subtract point from userScore
    this.topic.quiz.questions[i].hintOpened = true;
    this.topicsService.updateUserTopic(this.user.uid, this.topicId, this.topic);
  }

  submitQuiz() {
    if (confirm("Quiz sicher abgeben?")) {
      this.topic.quiz.isSubmitted = true;
      this.topic.quiz.score = this.getScore();
      this.topicsService.updateUserTopic(this.user.uid, this.topicId, this.topic).then(res => { this.toast.showSuccess("Quiz erfolgreich abgegeben.") });
    }
  }

  getScore() {
    const answeredQuestions: Array<any> = this.form.value.questionsArray;
    const questions: Array<Question> = this.topic.quiz.questions;
    let score = 0;
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].type == 5) {
        this.topic.quiz.questions[i].textAnswer = answeredQuestions[i].textAnswer;
        this.topic.quiz.questions[i].userScore = 0;
      }
      else {
        let correct = 0;
        // Loop Fragen
        for (let j = 0; j < questions[i].answers.length; j++) {
          const isChecked = answeredQuestions[i].answersArray[j].answer;
          this.topic.quiz.questions[i].answers[j].checked = isChecked;
          // Loop Antworten für Fragen
          if (this.topic.quiz.questions[i].answers[j].correct == isChecked) {
            correct += 1;
          }
          if (correct == questions[i].answers.length) {
            this.topic.quiz.questions[i].userScore = questions[i].points;
            score += questions[i].points;
          }
          else {
            this.topic.quiz.questions[i].userScore = 0;
          }
        }
      }
    }
    return score;
  }

  public updateScore(questionId: string) {
    const i = this.topic.quiz.questions.findIndex(x => x.id === questionId);
    const question = this.topic.quiz.questions[i];
    const questionsArrayValue = this.questionsArray.value[i];
    question.textAnswerCorrected = questionsArrayValue.textAnswerCorrected;
    console.log('userscore', question.userScore)

    if (question.isCorrected) {
      console.log('isCorrected')
      if (question.userScore >= questionsArrayValue.userScore) {
        console.log("userscore >= value")
        const diff = question.userScore - questionsArrayValue.userScore;
        this.topic.quiz.score -= diff;
        console.log('diff', diff)

      } else {
        console.log("userscore < value")
        const diff = questionsArrayValue.userScore - question.userScore;
        console.log('diff', diff)
        this.topic.quiz.score += diff;
      }
    } else {
      this.topic.quiz.score += question.userScore;
    }
    question.userScore = questionsArrayValue.userScore;
    console.log('New Score: ', this.topic.quiz.score)

    question.isCorrected = true;
    this.topic.quiz.isCorrected = true;
    this.topic.quiz.questions[i] = question;
    console.log(this.topic)
    this.topicsService.updateUserTopic(this.userId, this.topicId, this.topic);
  }
}