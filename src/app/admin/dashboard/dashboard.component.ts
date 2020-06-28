import { Component, OnInit } from '@angular/core';
import { Topic } from 'src/app/models/topic';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicsService } from 'src/app/services/topics.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  topic: Topic;

  constructor(private route: ActivatedRoute,
    private topicsService: TopicsService, public router: Router) { }

  ngOnInit(): void {
    this.getTopic();
  }

  getTopic(): Topic {
    const id = this.route.snapshot.paramMap.get('id');
    this.topic = this.topicsService.getTopic(id);
    return this.topic;
  }

  showComponent(){
    if(this.router.url == `/admin/dashboard/quiz/${this.topic.id}`){
      return 'quiz';
    }
    else if(this.router.url == `/admin/dashboard/topic/${this.topic.id}`){
      return 'questions'
    }
  }
}
