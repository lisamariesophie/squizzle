import { Component, OnInit, Input } from '@angular/core';
import { GapText } from 'src/app/_models/gaptext.model';
import { FormControl, FormArray, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Topic } from 'src/app/_models/topic.model';
import { TopicsDatabaseService } from 'src/app/_services/topics-database.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-question-create',
  templateUrl: './question-create.component.html',
  styleUrls: ['./question-create.component.scss']
})
export class QuestionCreateComponent implements OnInit {

  @Input() topic: Topic;
  @Input() id: string;

  form: FormGroup;
  answers: Array<any> = [];
  answersArray: Array<any> = [];
  gapText: Array<any> = [];
  correct: Array<any> = [];
  solution: any = '';
  gapCounter: number = 0;
  imgSrc: string = '';
  selectedImg: any = null;
  downloadUrl: string;

  constructor(public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder, private topicsService: TopicsDatabaseService, private route: ActivatedRoute, private afAuth: AngularFireAuth, private storage: AngularFireStorage) { }

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.form = this.formBuilder.group({
      type: ['', Validators.required],
      name: ['', Validators.required],
      checkArray: this.formBuilder.array([]),
      addAnswer: [''],
      addGap: [''],
      addGapText: [''],
      points: [''],
      hint: '',
      imgUrl: ''
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

  createQuestion() {
    for(let i = 0; i < this.answers.length; i++){
      if(this.answers[i] == this.checkArray.value){
        this.answersArray.push({ value: this.answers[i], correct: true })
      } else {
        this.answersArray.push({ value: this.answers[i], correct: false })
      }
      console.log(this.answersArray)
    }

    // stop here if form is invalid
    if (this.form.invalid) {
      console.log("Form invalid")
      return;
    }
    let question;
    // Multiple Choice
    if (this.selectedType == 1) {
      question = {
        id: this.generateID(),
        name: this.formControls.name.value,
        type: this.formControls.type.value,
        answers: Object.assign(this.answersArray),
        points: this.formControls.points.value,
        hint: this.formControls.hint.value,
        hintOpened: false
      }
    }
    // Wahr-Falsch
    if (this.selectedType == 2) {
      question = {
        id: this.generateID(),
        name: this.formControls.name.value,
        type: this.formControls.type.value,
        answers: Object.assign(this.answersArray),
        points: this.formControls.points.value,
        hint: this.formControls.hint.value,
        hintOpened: false
      }
    }
    // Skala Frage
    if (this.selectedType == 3) {
      question = {
        id: this.generateID(),
        name: this.formControls.name.value,
        type: this.formControls.type.value,
        points: 0,
        answers: Object.assign(this.answersArray)
      }
    }
    //Bild 
    if (this.selectedType == 4) {
      const filePath = `images/${this.selectedImg.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}` // avoid duplicate filenames
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImg).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            question = {
              id: this.generateID(),
              imgUrl: url,
              name: this.formControls.name.value,
              type: this.formControls.type.value,
              answers: Object.assign(this.answersArray),
              points: this.formControls.points.value,
              hint: this.formControls.hint.value,
              hintOpened: false
            }
            this.uploadQuestion(question);
          })
        })).subscribe(); //finalize -> wait for upload complete
        this.imgSrc = '';
        this.selectedImg = null;
      
    }
    // Freitext
    if (this.selectedType == 5) {
      this.correct.push(this.formControls.addAnswer.value);
      question = {
        id: this.generateID(),
        name: this.formControls.name.value,
        type: this.formControls.type.value,
        points: this.formControls.points.value,
        hint: this.formControls.hint.value,
        hintOpened: false
      }
    }
    // Lückentext
    if (this.selectedType == 6) {
      var map = this.gapText.map((obj) => { return Object.assign({}, obj) });
      question = {
        id: this.generateID(),
        type: this.formControls.type.value,
        name: this.formControls.name.value,
        gapText: map,
        points: this.formControls.points.value
      }
    }
    if(this.selectedType != 4){
      this.uploadQuestion(question);
    }
  }

  uploadQuestion(question: any) {
    if (!this.topic.hasOwnProperty('quiz')) {
      console.log("'Quiz empty")
      const quiz = { questions: [], submitted: false };
      this.topic.quiz = quiz;
    }
    this.topic.quiz.questions.push(question);
    this.afAuth.authState.subscribe(user => {
      if (user) {
        const userId = user.uid;
        this.topicsService.updateTopic(userId, this.id, this.topic);
      }
    });
  }

  showImgPrev(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImg = event.target.files[0];
    } else {
      //reset if no Img chosen
      this.imgSrc = '';
      this.selectedImg = null;
    }
  }


  toLetters(num) {
    "use strict";
    var mod = num % 26,
      pow = num / 26 | 0,
      out = mod ? String.fromCharCode(64 + mod) : (--pow, 'Z');
    return pow ? this.toLetters(pow) + out : out;
  }

  fromLetters(str) {
    "use strict";
    var out = 0, len = str.length, pos = len;
    while (--pos > -1) {
      out += (str.charCodeAt(pos) - 64) * Math.pow(26, len - 1 - pos);
    }
    return out;
  }
}