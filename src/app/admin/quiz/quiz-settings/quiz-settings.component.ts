import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Topic } from 'src/app/models/topic';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TopicsService } from 'src/app/services/topics.service';
import { Settings } from 'src/app/models/settings';

@Component({
  selector: 'app-quiz-settings',
  templateUrl: './quiz-settings.component.html',
  styleUrls: ['./quiz-settings.component.scss']
})
export class QuizSettingsComponent implements OnInit {

  @Input() topic: Topic;
  @Input() id: string;
  submitted = false;
  form: FormGroup;

  constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder, private topicsService: TopicsService) { }

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.form = this.formBuilder.group({
      time: ['', Validators.required]
    });
  }

  get formControls() { return this.form.controls; }

  submitForm() {
    if(this.topic.settings == null){
      this.topic.settings = new Settings();
    }
    this.topic.settings.time = this.formControls.time.value;
    this.topicsService.updateTopic(this.topic);
  }
}
