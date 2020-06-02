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
      correct: ['', Validators.required]
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

  newQuestion(){
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

  public createQuestion() {
    const question = new Question();
    question.name = this.formControls.name.value;
    question.type = this.formControls.type.value;
    question.correct = this.formControls.correct.value;
    question.answers = Object.assign(this.answers);
    this.topicsService.updateTopic(this.topic, this.id, this.topicType, question);
  }
}