import { Component, OnInit } from '@angular/core';
import { Topic } from 'src/app/models/topic';
import { ActivatedRoute } from '@angular/router';
import { TopicsService } from 'src/app/services/topics.service';
import { Question } from 'src/app/models/question';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

  topic: Topic;
  IsHidden= true;

  constructor(private route: ActivatedRoute,
    private topicsService: TopicsService) { }

  ngOnInit(): void {
    this.getTopic();
  }

  getTopic(): Topic {
    const id = this.route.snapshot.paramMap.get('id');
    this.topic = this.topicsService.getTopic(id);
    return this.topic;
  }

  get Topic() {
    return this.topic;
  }

  getQuestionType(i: number) {
    if(i == 1){
      return "Single Choice";
    }
    else if(i == 2){
      return "Multiple Choice";
    }
    else if(i == 4){
      return "Freitext";
    }
  }

  showHint(i:number, question:Question){
    const hintDiv = document.getElementById(`hint${i}`);
    const hintBtn = document.getElementById(`hintBtn${i}`);
    hintBtn.hidden = true;
    const hintText = document.createTextNode("Hinweis: " + question.hint);
    question.points -= 1;
    hintDiv.appendChild(hintText);
   }
   
}
