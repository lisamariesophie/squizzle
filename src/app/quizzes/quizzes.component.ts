import { Component, OnInit } from '@angular/core';
import { Topic } from '../_models/topic.model';
import { TopicsDatabaseService } from '../_services/topics-database.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-quizzes',
  templateUrl: './quizzes.component.html',
  styleUrls: ['./quizzes.component.scss']
})
export class QuizzesComponent implements OnInit {
  user: any;
  topics: Topic[];

  constructor(private topicsDatabase: TopicsDatabaseService, private afAuth: AngularFireAuth) { }

  ngOnInit() {
    this.getTopics();
  }



  getTopics() {
    this.afAuth.authState.subscribe(user => {
      if(user) {
        const userId = user.uid;
        this.topicsDatabase.getUserTopics(userId).snapshotChanges().subscribe(res => {
          this.topics = res.map(document => {
            return {
              id: document.payload.doc.id,
              ...document.payload.doc.data() as {}
            } as Topic;
          })
        })
      } 
    });
  }
}
