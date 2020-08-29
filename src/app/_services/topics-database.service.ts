import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Topic } from '../_models/topic.model';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class TopicsDatabaseService {
  topicsRef: AngularFirestoreCollection<Topic> = null;
  userRef: AngularFirestoreCollection<Topic> = null;

  constructor(private firestore: AngularFirestore) {
    this.userRef = this.firestore.collection('users');
    this.topicsRef = this.firestore.collection('topics', ref => ref.orderBy('name', 'desc'));
    
  }

  getTopics(uid: string) {
    return this.userRef.doc(uid).collection('topics');
  }

  getTopic(uid: string, id: string): any {
    return this.userRef.doc(uid).collection('topics').doc(id).valueChanges();
  }

  createTopic(uid: string, topic: Topic) {
    return this.userRef.doc(uid).collection('topics').add(topic);
  }

  updateTopic(uid: string, id:string, topic: Topic) {
    return this.userRef.doc(uid).collection('topics').doc(id).update(topic);
  }

  deleteTopic(key: string): Promise<void> {
    return this.topicsRef.doc(key).delete();
  }
}
