import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TopicUsersService {

  constructor(private firestore: AngularFirestore ) { }

  createUserTopic(item: any) {
    this.firestore.collection('TopicUsers').add(item);
  }

  getTopicUsers(topicId: string) {
    return this.topicUsersCollection(topicId); //returns Users for topic
  }

  topicUsersCollection(topicId: string) {
    return this.firestore.collection('TopicUsers', ref => ref.where("topicId", '==', topicId))
  }
}
