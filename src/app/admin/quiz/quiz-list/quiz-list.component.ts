import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { TopicsService } from 'src/app/services/topics.service';
import { Topic } from 'src/app/models/topic';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss']
})
export class QuizListComponent implements OnInit {

  topic: Topic;

  constructor(private route: ActivatedRoute,
    private topicsService: TopicsService,
    private location: Location) { }

    ngOnInit(): void {
      this.getHero();
    }

    getHero(): void {
      const name = this.route.snapshot.paramMap.get('name');
      this.topic = this.topicsService.getTopic(name);
      console.log(this.topic)
    }

    get Topic() {
      return this.topic;
    }

}
