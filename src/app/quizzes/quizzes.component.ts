import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Topic } from '../_models/topic.model';
import { TopicsDatabaseService } from '../_services/topics-database.service';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-quizzes',
  templateUrl: './quizzes.component.html',
  styleUrls: ['./quizzes.component.scss']
})
export class QuizzesComponent implements OnInit {

  topics: Topic[];

  constructor(private topicsDatabase: TopicsDatabaseService, private afAuth: AngularFireAuth) { }

  ngOnInit() {
    this.getTopics();
  }

  getTopics() {
    this.afAuth.authState.subscribe(user => {
      if(user) {
        const userId = user.uid;
        this.topicsDatabase.getTopics(userId).snapshotChanges().subscribe(response => {
          this.topics = response.map(document => {
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
