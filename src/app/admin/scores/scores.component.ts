import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../_services/users.service';
import { TopicUsersService } from '../../_services/topicUsers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TopicsDatabaseService } from '../../_services/topics-database.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { Topic } from '../../_models/topic.model';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import { ChartType, ChartOptions } from 'chart.js';
import { TopicUser } from '../../_models/topicUser.model';
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
  selectedUserId: string;
  showQuiz: boolean = false;
  colors = [];
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  // ng-charts variables
  public pieChartLabels: Label[] = [];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'doughnut';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public chartColors: Array<any> = [{ backgroundColor: this.colors }];


  constructor(public router: Router, protected topicsService: TopicsDatabaseService, protected topicUserService: TopicUsersService, protected userService: UsersService, protected authService: AuthenticationService, protected modalService: NgbModal, protected route: ActivatedRoute) {
    this.selectedUserId = ''
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
    this.topicId = this.route.snapshot.paramMap.get('id');
    this.getUsers();
  }

  // set the selected user from html on click with userId for selected row
  setSelectedUser(userId: string){
    this.selectedUserId = userId;
    this.showQuiz = !this.showQuiz;
  }

  // get topic by id
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
        this.colors.push(this.getRandomColor()); // add random color to chart
      }
      this.getScoreOccurence();
    });
  }

  // generate colors for Chart
  getRandomColor() {
    const hue = Math.floor(Math.random() * 12) * 30;
    const randomColor = `hsl(${hue}, 70%, 75%)`;
    return randomColor;
  }

  // get number of scores with same value and set to chart
  getScoreOccurence() {
    let labels = [], data = [], prev;
    this.scores.sort();
    for (let i = 0; i < this.scores.length; i++) {
      if (this.scores[i] !== prev) {
        labels.push(`${this.scores[i]} Punkte`);
        data.push(1);
      } else {
        data[data.length - 1]++;
      }
      prev = this.scores[i];
    }
    this.pieChartData = data;
    this.pieChartLabels = labels;
    return [labels, data];
  }
}




