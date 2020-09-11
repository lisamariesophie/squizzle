import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TopicUsersService {

  constructor(private firestore: AngularFirestore) { }

  topicUsersCollection(topicId: string) {
    return this.firestore.collection('TopicUsers', ref => ref.where("topicId", '==', topicId))
  }

  //create a TopicUser Object ({topicId, userId})
  createTopicUser(topicUser: any) {
    this.firestore.collection('TopicUsers').add(topicUser);
  }
  
  //returns Users of a Topic by topicId
  getTopicUsers(topicId: string) {
    return this.topicUsersCollection(topicId);
  }
}
