import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicsService } from 'src/app/_services/topics.service';
import { Topic } from 'src/app/_models/topic.model';
import { TopicsDatabaseService } from 'src/app/_services/topics-database.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  topic: Observable<Topic>;

  constructor(private route: ActivatedRoute, public router: Router) { }

  showComponent() {
    const id = this.route.snapshot.paramMap.get('id');
    if (this.router.url == `/admin/quiz/${id}`) {
      return 'quiz';
    }
    else if (this.router.url == `/admin/topic/${id}`) {
      return 'questions';
    }
    else if (this.router.url == `/admin/quiz/scores/${id}`) {
      return 'scores';
    }
  }
}
