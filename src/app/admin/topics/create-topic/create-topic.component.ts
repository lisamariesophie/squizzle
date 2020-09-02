import { Component, OnInit, Input } from '@angular/core';
import { Quiz } from 'src/app/_models/quiz.model';
import { Topic } from 'src/app/_models/topic.model';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TopicsService } from 'src/app/_services/topics.service';
import { TopicsDatabaseService } from 'src/app/_services/topics-database.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-create-topic',
  templateUrl: './create-topic.component.html',
  styleUrls: ['./create-topic.component.scss']
})
export class CreateTopicComponent implements OnInit {

  @Input() id: number;
  form: FormGroup;
  subtopics = [];
  topic = {
    name: [],
    subtopics: Array<Topic>(),
  };
  submitted = false;

  constructor(public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder, private topicsService: TopicsDatabaseService, private afAuth: AngularFireAuth) { }

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.form = this.formBuilder.group({
      topic: ['', Validators.required],
      subtopic: ''
    });
  }

  get formControls() { return this.form.controls; }

  public submitForm() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.addTopic();
    this.activeModal.close(this.form.value);
  }

  // private generateID(): string {
  //   return (
  //     Number(String(Math.random()).slice(2)) +
  //     Date.now() +
  //     Math.round(performance.now())
  //   ).toString(36);
  // }

  private addTopic() {
    this.afAuth.authState.subscribe(user => {
      if(user) {
        const topic: Topic = {
          live: false,
          name: this.formControls.topic.value,
          authorUID: user.uid
        };
        this.topicsService.createTopic(topic);
      }
    });
    
  }

}

