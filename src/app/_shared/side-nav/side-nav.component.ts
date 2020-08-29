import { Component, OnInit } from '@angular/core';
import { Topic } from 'src/app/_models/topic.model';
import { ActivatedRoute } from '@angular/router';
import { TopicsService } from 'src/app/_services/topics.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {

  topic: Topic;
  topicId: string; 

  constructor(private route: ActivatedRoute,
    private topicsService: TopicsService) { }
    

  ngOnInit(): void {
    this.topicId = this.route.snapshot.paramMap.get('id');
    this.getTopic();
  }

  getTopic(): Topic {
    this.topic = this.topicsService.getTopic(this.topicId);
    return this.topic;
  }
}
