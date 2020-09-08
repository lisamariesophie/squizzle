import { Component, OnInit } from '@angular/core';
import { UsersService } from '../_services/users.service';
import { TopicUsersService } from '../_services/topicUsers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from '../admin/dashboard/dashboard.component';
import { TopicsDatabaseService } from '../_services/topics-database.service';
import { AuthenticationService } from '../_services/authentication.service';
import { Topic } from '../_models/topic.model';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import { ChartType, ChartOptions } from 'chart.js';
import { TopicUser } from '../_models/topicUser.model';
import { take } from 'rxjs/operators';



@Component({
  selector: 'app-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.scss']
})
export class ScoresComponent {

  topic: Topic;
  topicId: string;
  topicUsers: any = [];
  users: any[] = [];
  scores: any[] = [];
  colors = [];
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'doughnut';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public chartColors: Array<any> = [{ backgroundColor: this.colors }];
  selectedUserId: string;
  showQuiz: boolean = false;

  constructor(public router: Router, protected topicsService: TopicsDatabaseService, protected topicUserService: TopicUsersService, protected userService: UsersService, protected authService: AuthenticationService, protected modalService: NgbModal, protected route: ActivatedRoute) {
    this.selectedUserId = ''
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
    this.topicId = this.route.snapshot.paramMap.get('id');
    this.getUsers();
  }

  setSelectedUser(userId: string){
    this.selectedUserId = userId;
    this.showQuiz = !this.showQuiz;
  }

  getTopic() {
    this.topicsService.getTopic(this.topicId).subscribe(res => {
      this.topic = res;
    });
  }

  // Get all Users for Topic by topicId (get TopicUser Object {userId, topicId})
  getUsers() {
    this.topicUserService.getTopicUsers(this.topicId).snapshotChanges().pipe(take(1)).subscribe(response => {
      this.topicUsers = response.map(document => {
        const user = document.payload.doc.data();
        this.getUser(user)
        return {
          id: document.payload.doc.id,
          ...document.payload.doc.data() as {}
        } as TopicUser;
      })
    })
  }

  // Get every single user for Topic (get User Object {uid, email, roles})
  getUser(user: any) {
    this.userService.getUser(user.userId).pipe(take(1)).subscribe(res => {
      const user = res;
      this.getUserTopic(user)
    });
  }

  // Get Topic Data by topicId from User 
  getUserTopic(user: any) {
    this.userService.getUserTopic(user.uid, this.topicId).pipe(take(1)).subscribe(res => {
      const topic: any = res;
      this.topic = topic;
      this.users.push({ user: user, topic: topic })
      if (topic.quiz.score != null) {
        this.scores.push(topic.quiz.score);
        this.colors.push(this.getRandomColor());
      }
      this.getScoreOccurence(this.scores);
    });
  }

  getRandomColor() {
    const hue = Math.floor(Math.random() * 12) * 30;
    const randomColor = `hsl(${hue}, 70%, 75%)`;
    return randomColor;
  }

  getScoreOccurence(arr) {
    let a = [], b = [], prev;
    arr.sort();
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] !== prev) {
        a.push(`${arr[i]} Punkte`);
        b.push(1);
      } else {
        b[b.length - 1]++;
      }
      prev = arr[i];
    }
    this.pieChartData = b;
    this.pieChartLabels = a;
    return [a, b];
  }
}




