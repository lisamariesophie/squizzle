import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TopicsService } from 'src/app/services/topics.service';
import { Topic } from 'src/app/models/topic';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements OnInit {

  topics: Topic[];

  constructor(private topicsService: TopicsService, public router: Router) { }

  ngOnInit() {
    this.topics = this.topicsService.getTopics();
  }

  get topicArray() {
    return this.topics;
  }

}
