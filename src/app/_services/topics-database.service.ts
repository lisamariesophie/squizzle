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

  getTopics(uid: string) {
    return this.topicsCollection(uid);
  }
  
  getUserTopics(id: string){
    return this.userRef.doc(id).valueChanges();
  }

  getTopic(id: string): any {
    return this.topicsRef.doc(id).valueChanges();
  }

  createTopic(topic: Topic) {
    return this.topicsRef.add(topic);
  }

  updateTopic(uid: string, id:string, topic: Topic) {
    return this.topicsCollection(uid).doc(id).update(topic);
  }

  deleteTopic(id: string) {
    return this.topicsRef.doc(id).delete();
  }

  topicsCollection(uid) {
    return this.firestore.collection('topics', ref => ref.where("authorUID", '==', uid))
  }
}
