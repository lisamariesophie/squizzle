import { Component, OnInit, Input } from '@angular/core';
import { GapText } from 'src/app/_models/gaptext.model';
import { FormControl, FormArray, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Topic } from 'src/app/_models/topic.model';
import { TopicsDatabaseService } from 'src/app/_services/topics-database.service';
import { Quiz } from 'src/app/_models/quiz.model';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-question-create',
  templateUrl: './question-create.component.html',
  styleUrls: ['./question-create.component.scss']
})
export class QuestionCreateComponent implements OnInit {

  @Input() topic: Topic;
  @Input() id: string;

  submitted = false;
  form: FormGroup;
  answers: Array<any> = [];
  gapText: Array<GapText> = [];
  correct: Array<any> = [];
  solution;
  gapCounter: number = 0;

  constructor(public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder, private topicsService: TopicsDatabaseService, private route: ActivatedRoute, private afAuth: AngularFireAuth) { }

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.form = this.formBuilder.group({
      type: ['', Validators.required],
      name: ['', Validators.required],
      checkArray: this.formBuilder.array([]),
      addAnswer: ['', Validators.required],
      addGap: ['', Validators.required],
      addGapText: ['', Validators.required],
      points: ['', Validators.required],
      hint: ''
    });
  }

  get formControls() { return this.form.controls; }

  get checkArray() {
    return this.form.get('checkArray') as FormArray;
  }

  get selectedType() {
    return this.formControls.type.value;
  }

  onCheckboxChange(e) {
    if (e.target.checked) {
      this.checkArray.push(new FormControl(e.target.value));
      console.log(this.checkArray);
    }
    else {
      let i: number = 0;
      this.checkArray.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          this.checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  public setAnswers(event) {
    const value = event.target.value;
    if (value == 2) {
      this.answers = ["Wahr", "Falsch"]
    }
    if (value == 3) {
      this.answers = ["Stimme gar nicht zu", "Stimme nicht zu", "Neutral", "Stimme zu", "Stimme voll zu", "Keine Angabe"];
      console.log(this.answers);
    }
    if (value == 6) {
      this.gapText = [];
    }
  }

  public addAnswer() {
    this.answers.push(this.formControls.addAnswer.value);
    this.formControls.addAnswer.reset();
  }

  public addGapText(type: number) {
    let gapText: GapText = new GapText();
    if (type == 1) {
      gapText.type = 1;
      gapText.value = this.formControls.addGapText.value;
      this.formControls.addGapText.reset();
    }
    else if (type == 2) {
      gapText.type = 2;
      gapText.value = this.formControls.addGap.value;
      this.formControls.addGap.reset();

    }
    gapText.id = this.gapCounter;
    this.gapCounter++;
    this.gapText.push(gapText);
    this.solution += gapText.value;
  }

  public submitForm() {
    this.createQuestion();
    this.activeModal.close(this.form.value);
  }

  newQuestion() {
    this.createQuestion();
    this.answers = [];
    this.form.reset();
  }

  private generateID(): string {
    return (
      Number(String(Math.random()).slice(2)) +
      Date.now() +
      Math.round(performance.now())
    ).toString(36);
  }

  public createQuestion() {
    this.submitted = true;
    // stop here if form is invalid
    // if (this.form.invalid) {
    //   console.log("Form invalid")
    //   return;
    // }
    let question;
    // Multiple Choice
    if (this.selectedType == 1) {
      question = {
        id: this.generateID(),
        name: this.formControls.name.value,
        type: this.formControls.type.value,
        answers: Object.assign(this.answers),
        correct: Object.assign(this.checkArray.value),
        points: this.formControls.points.value,
        hint: this.formControls.hint.value
      }
    }
    // Wahr-Falsch
    if (this.selectedType == 2) {
      question = {
        id: this.generateID(),
        name: this.formControls.name.value,
        type: this.formControls.type.value,
        answers: Object.assign(this.answers),
        correct: Object.assign(this.checkArray.value),
        points: this.formControls.points.value,
        hint: this.formControls.hint.value
      }
    }
    // Skala Frage
    if (this.selectedType == 3) {
      question = {
        id: this.generateID(),
        name: this.formControls.name.value,
        type: this.formControls.type.value,
        points: 0,
        answers: Object.assign(this.answers)
      }
    }
    // Freitext
    if (this.selectedType == 5) {
      this.correct.push(this.formControls.addAnswer.value);
      question = {
        id: this.generateID(),
        name: this.formControls.name.value,
        type: this.formControls.type.value,
        correct: Object.assign(this.correct),
        points: this.formControls.points.value,
        hint: this.formControls.hint.value
      }
    }
    // Lückentext
    if (this.selectedType == 6) {
      question = {
        id: this.generateID(),
        type: this.formControls.type.value,
        name: this.formControls.name.value,
        gapText: Object.assign(this.gapText),
        points: this.formControls.points.value
      }
    }
    if (!this.topic.hasOwnProperty('quiz')) {
      console.log("'Quiz empty")
      const quiz = {questions: []};
      this.topic.quiz = quiz;
    }
    this.topic.quiz.questions.push(question);
    this.afAuth.authState.subscribe(user => {
      if(user) {
        const userId = user.uid;
        this.topicsService.updateTopic(userId, this.id, this.topic);
      }
    });
  }


  public toLetters(num) {
    "use strict";
    var mod = num % 26,
      pow = num / 26 | 0,
      out = mod ? String.fromCharCode(64 + mod) : (--pow, 'Z');
    return pow ? this.toLetters(pow) + out : out;
  }

  public fromLetters(str) {
    "use strict";
    var out = 0, len = str.length, pos = len;
    while (--pos > -1) {
      out += (str.charCodeAt(pos) - 64) * Math.pow(26, len - 1 - pos);
    }
    return out;
  }
}