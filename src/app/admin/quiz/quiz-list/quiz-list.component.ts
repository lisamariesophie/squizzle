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
      this.getTopic();
    }

    getTopic(): void {
      const name = this.route.snapshot.paramMap.get('name');
      this.topic = this.topicsService.getTopic(name);
    }

    get Topic() {
      return this.topic;
    }

    goBack(): void {
      this.location.back();
    }

}
