import { Component, OnInit } from '@angular/core';
import { TopicsService } from '../services/topics.service';
import { ActivatedRoute } from '@angular/router';
import { Topic } from '../models/topic';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {

  topic: Topic;

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
}
