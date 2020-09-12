import { Component, OnInit, Input } from '@angular/core';
import { Topic } from 'src/app/_models/topic.model';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TopicsDatabaseService } from 'src/app/_services/topics-database.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ToastService } from 'src/app/_services/toast.service';
import { ConnectionService } from 'src/app/_services/connection.service';
import { TopicsService } from 'src/app/_services/topics.service';

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

  constructor(public activeModal: NgbActiveModal, private connectionService: ConnectionService, private localTopic: TopicsService,
    private formBuilder: FormBuilder, private topicsService: TopicsDatabaseService, private authService: AuthenticationService, private toast: ToastService) { }

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.form = this.formBuilder.group({
      topic: ['', Validators.required]
    });
  }

  get formControls() { return this.form.controls; }

  public submitForm() {
    if (this.form.invalid) {
      return;
    }
    this.addTopic();
    this.activeModal.close(this.form.value);
  }

  private addTopic() {
    if (this.connectionService.isOnline) {
      this.authService.user.subscribe(user => {
        if (user) { //
          const topic: Topic = {
            live: false,
            name: this.formControls.topic.value,
            authorUID: user.uid
          };
          this.topicsService.createTopic(topic).then(res => {
            this.toast.showSuccess("Thema hinzugefügt")
          }).catch(err => {
            this.toast.showError("Thema konnte nicht hinzugefügt werden: " + err);
          });;
        }
      });
    }
    else {
      const topic: Topic = {
        localId: this.generateID(),
        live: false,
        name: this.formControls.topic.value,
        authorUID: ""
      };
      this.localTopic.createTopic(topic);
    }
  }

  private generateID(): string {
    return (
      Number(String(Math.random()).slice(2)) +
      Date.now() +
      Math.round(performance.now())
    ).toString(36);
  }

}

