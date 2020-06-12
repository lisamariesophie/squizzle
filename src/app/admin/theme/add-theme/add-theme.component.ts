import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Subtopic } from 'src/app/models/subtopic';
import { TopicsService } from 'src/app/services/topics.service';
import { Quiz } from 'src/app/models/quiz';
import { Topic } from 'src/app/models/topic';

@Component({
  selector: 'app-add-theme',
  templateUrl: './add-theme.component.html',
  styleUrls: ['./add-theme.component.scss']
})
export class AddThemeComponent implements OnInit, OnChanges {

  @Input() id: number;
  form: FormGroup;
  subtopics = [];
  topic = {
    name: [],
    subtopics: Array<Subtopic>()
  }

  constructor(public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder, private topicsService: TopicsService) { }

  ngOnInit() {
    this.createForm();
  }

  ngOnChanges() {
    this.topicsService.getTopics();
  }

  private createForm() {
    this.form = this.formBuilder.group({
      topic: '',
      subtopic: ''
    });
  }

  public addSubtopic() {
    this.subtopics.push(this.formControls.subtopic.value);
    this.formControls.subtopic.reset();
  }

  get formControls() { return this.form.controls; }

  public submitForm() {
    this.addTopic();
    this.activeModal.close(this.form.value);
  }

  private generateID(): string {
    return '_' + (
      Number(String(Math.random()).slice(2)) + 
      Date.now() + 
      Math.round(performance.now())
    ).toString(36);
  }

  private addTopic() {
    const quiz = new Quiz();
    quiz.questions = [];
    const subtopics = this.subtopics.slice();
    this.topic.subtopics.length = subtopics.length;
    for (let i = 0; i < subtopics.length; i++) {
      this.topic.subtopics[i] = new Subtopic();
      this.topic.subtopics[i].id = this.generateID();
      this.topic.subtopics[i].name = subtopics[i];
      this.topic.subtopics[i].quiz = quiz;
    }
    const topic: Topic = {
      id: this.generateID(),
      live: false,
      name: this.formControls.topic.value,
      subtopics: Object.assign(this.topic.subtopics),
      quiz: quiz
    }
    this.topicsService.createTopic(topic);
    
  }
}
