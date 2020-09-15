import { Component, OnInit, Input } from '@angular/core';
import { Topic } from 'src/app/_models/topic.model';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
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

  form: FormGroup;

  constructor(public activeModal: NgbActiveModal, private connectionService: ConnectionService, private localTopic: TopicsService,
    private formBuilder: FormBuilder, private topicsService: TopicsDatabaseService, private authService: AuthenticationService, private toast: ToastService) { }

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.form = this.formBuilder.group({
      topicName: new FormControl('', Validators.required)
    });
  }

  get formControls() { return this.form.controls; }

  // on submit form
  public submitForm() {
    if (this.form.invalid) {
      return;
    }
    this.addTopic();
    this.activeModal.close(this.form.value);
  }

  // Save topic to localstorage or database
  private addTopic() {
    if (this.connectionService.isOnline) {
      this.authService.user.subscribe(user => {
        if (user) { //
          const topic: Topic = {
            isLive: false,
            name: this.formControls.topicName.value,
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
        isLive: false,
        name: this.formControls.topicName.value
      };
      this.localTopic.createTopic(topic);
    }
  }

  // generate a random topic Id
  private generateID(): string {
    return (
      Number(String(Math.random()).slice(2)) +
      Date.now() +
      Math.round(performance.now())
    ).toString(36);
  }

}

