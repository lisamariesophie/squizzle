import { Component, OnInit, Input } from '@angular/core';
import { TopicsService } from 'src/app/services/topics.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Question } from 'src/app/models/question';
import { Topic } from 'src/app/models/topic';
import { Quiz } from 'src/app/models/quiz';

@Component({
  selector: 'app-quiz-create',
  templateUrl: './quiz-create.component.html',
  styleUrls: ['./quiz-create.component.scss']
})
export class QuizCreateComponent implements OnInit {

  @Input() topic: Topic;
  @Input() id: string;
  @Input() topicType: string;

  submitted = false;
  form: FormGroup;
  answers: Array<any> = [];
  correct: Array<any> = [];

  constructor(public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder, private topicsService: TopicsService) {}

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.form = this.formBuilder.group({
      type: ['', Validators.required],
      name: ['', Validators.required],
      checkArray: this.formBuilder.array([]),
      addAnswer: ['', Validators.required],
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
    const checkArray: FormArray = this.form.get('checkArray') as FormArray;
    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
      console.log(checkArray);
    }
    else {
      let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  public addAnswer() {
    this.answers.push(this.formControls.addAnswer.value);
    this.formControls.addAnswer.reset();
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
    if (this.form.invalid) {
      return;
    }
    let question;
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
    if (this.selectedType == 4) {
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
    console.log(question);
    this.topicsService.updateQuestions(this.topic, this.topicType, question);
  }
}