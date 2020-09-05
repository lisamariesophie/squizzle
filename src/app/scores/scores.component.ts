import { Component, OnInit } from '@angular/core';
import { UsersService } from '../_services/users.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../_models/user';
import { TopicUsersService } from '../_services/topicUsers.service';
import { ActivatedRoute } from '@angular/router';
import { TopicUser } from '../_models/topicUser.model';
import { take } from 'rxjs/operators';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuizComponent } from '../quiz/quiz.component';

@Component({
  selector: 'app-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.scss']
})
export class ScoresComponent implements OnInit {
  colors = [];
  topicUsers: any = [];
  topicId: string;
  userId: any;
  users: any[] = [];
  scores: any[] = [];
  showPieChart: boolean = false;
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'doughnut';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public chartColors: Array<any> = [{backgroundColor: this.colors}];

  constructor(private topicUserService: TopicUsersService, private userService: UsersService, protected modalService: NgbModal, private route: ActivatedRoute) {
    this.topicId = this.route.snapshot.paramMap.get('id');
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit() {
    this.getUsers();
  }

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

  getUser(user: any) {
    this.userService.getUser(user.userId).pipe(take(1)).subscribe(res => {
      const user = res;
      this.getTopicsForUser(user)
    });
  }

  getTopicsForUser(user) {
    this.userService.getTopicsForUser(user.uid, this.topicId).pipe(take(1)).subscribe(res => {
      const topic: any = res;
      this.users.push({ user: user, topic: topic })
      if (topic.quiz.score != null) {
        this.scores.push(topic.quiz.score);
        this.colors.push(this.getRandomColor());
      }
      this.getScoreOccurence(this.scores);
    });
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


  getRandomColor() {
    const hue = Math.floor(Math.random() * 12) * 30;
    const randomColor = `hsl(${hue}, 70%, 75%)`;
    return randomColor;
  }

  openFormModal(user) {
    const modalRef = this.modalService.open(QuizComponent, { ariaLabelledBy: 'quiz', windowClass: "myCustomModalClass" });
    modalRef.componentInstance.preview = true;
    modalRef.componentInstance.user = user;
    modalRef.result.then((result) => {
    }).catch((error) => {
    });
  }
}




