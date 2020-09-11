import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Topic } from '../_models/topic.model';

@Injectable({
  providedIn: 'root'
})
export class TopicsDatabaseService {
  topicsRef: AngularFirestoreCollection<Topic> = null;
  userRef: AngularFirestoreCollection<Topic> = null;

  constructor(private firestore: AngularFirestore) {
    this.userRef = this.firestore.collection('users');
    this.topicsRef = this.firestore.collection('topics');

  }

  // return topicsCollection with only topics created by the CurrentUser
  topicsCollection(uid) {
    return this.firestore.collection('topics', ref => ref.where("authorUID", '==', uid))
  }

  // get all TOpics from TopicsCollection
  getTopics(uid: string) {
    return this.topicsCollection(uid);
  }

  // get Topic by Id
  getTopic(id: string): any {
    return this.topicsRef.doc(id).valueChanges();
  }

  // create a new Topic
  createTopic(topic: Topic) {
    return this.topicsRef.add(topic);
  }

  // update a topic
  updateTopic(uid: string, id: string, topic: Topic) {
    return this.topicsCollection(uid).doc(id).update(topic);
  }

  // delete a Topic
  deleteTopic(id: string) {
    return this.topicsRef.doc(id).delete();
  }

  // get all Topics by UserId
  getUserTopics(userId: string): any {
    return this.userRef.doc(userId).collection('topics');
  }

  // get Topic for user by topicId
  getUserTopic(userId: string, topicId: string) : any {
    return this.userRef.doc(userId).collection('topics').doc(topicId).valueChanges();
  }

  // Create new topic for User by topicId
  createUserTopic(userId: string, topicId: string, topic: any) {
    return this.userRef.doc(userId).collection('topics').doc(topicId).set(topic);
  }

  // update Topic for user by topicId
  updateUserTopic(userId: string, topicId: string, topic: Topic) {
    return this.userRef.doc(userId).collection('topics').doc(topicId).update(topic);
  }  
}
