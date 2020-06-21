import { Component, OnInit, Input } from '@angular/core';
import { TopicsService } from 'src/app/services/topics.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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


  form: FormGroup;
  answers = [];

  constructor(public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder, private topicsService: TopicsService) { }

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.form = this.formBuilder.group({
      type: ['', Validators.required],
      name: ['', Validators.required],
      answer: '',
      correct: ['', Validators.required],
      points: ['', Validators.required],
      hint: ''
    });
  }

  get selectedType() {
    return this.formControls.type.value;
  }

  get formControls() { return this.form.controls; }

  public submitForm() {
    this.createQuestion();
    this.activeModal.close(this.form.value);
  }

  public addAnswer() {
    this.answers.push(this.formControls.answer.value);
    this.formControls.answer.reset();
  }

  newQuestion() {
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

  get answersArray() {
    return this.answers;
  }

  private generateID(): string {
    return (
      Number(String(Math.random()).slice(2)) +
      Date.now() +
      Math.round(performance.now())
    ).toString(36);
  }

  public createQuestion() {
    let question;
    console.log(this.selectedType)
    if (this.selectedType == 1) {
      console.log("single");
      question = {
        id: this.generateID(),
        name: this.formControls.name.value,
        type: this.formControls.type.value,
        correct: this.formControls.correct.value,
        answers: Object.assign(this.answers),
        points: this.formControls.points.value,
        hint: this.formControls.hint.value
      }
    }
    if (this.selectedType == 4) {
      console.log("free");
      this.answers.push(this.formControls.answer.value);
      question = {
        id: this.generateID(),
        name: this.formControls.name.value,
        type: this.formControls.type.value,
        answers: Object.assign(this.answers),
        points: this.formControls.points.value,
        hint: this.formControls.hint.value
      }
    }

    console.log(question)

    this.topicsService.updateTopic(this.topic, this.id, this.topicType, question);
  }
}