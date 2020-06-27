import { Component, OnInit } from '@angular/core';
import { Topic } from 'src/app/models/topic';
import { ActivatedRoute } from '@angular/router';
import { TopicsService } from 'src/app/services/topics.service';
import { Question } from 'src/app/models/question';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

  topic: Topic;
  form: FormGroup;

  constructor(private route: ActivatedRoute,
    private topicsService: TopicsService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getTopic();
    this.createForm();
    console.log(this.form)

  }
  private createForm() {
    this.form = this.formBuilder.group({
      answer: '',
      userAnswers: this.formBuilder.array([this.formBuilder.group({
        userAnswer: ['', [Validators.required]],
      })])
    });
  }

  get formControls() { return this.form.controls; }


  getTopic(): Topic {
    const id = this.route.snapshot.paramMap.get('id');
    this.topic = this.topicsService.getTopic(id);
    return this.topic;
  }

  get Topic() {
    return this.topic;
  }

  getQuestionType(question: Question) {

    if (question.type == 1 && question.correct.length > 1) {
      return "Multiple Choice";
    }

    else if (question.type == 4) {
      return "Freitext";
    }

    else {
      return "Single Choice";
    }
  }

  showHint(i: number, question: Question) {
    const hintDiv = document.getElementById(`hint${i}`);
    const hintBtn = document.getElementById(`hintBtn${i}`);
    hintBtn.hidden = true;
    const hintText = document.createTextNode("Hinweis: " + question.hint);
    this.topic.quiz.questions[i].points -= 1;
    hintDiv.appendChild(hintText);
  }

  submitQuiz() {

  }

}
