import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-add-theme',
  templateUrl: './add-theme.component.html',
  styleUrls: ['./add-theme.component.scss']
})
export class AddThemeComponent implements OnInit {

  @Input()id: number;
  form: FormGroup;
  subtopics = [];

  constructor(public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder) { }

    ngOnInit() {
      this.createForm();
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
      this.activeModal.close(this.form.value);
    }
}
