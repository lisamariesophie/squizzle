import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  userRef: AngularFirestoreCollection<User> = null;

  constructor(private firestore: AngularFirestore) {
    this.userRef = this.firestore.collection('users');
  }

  getUsers(topicId: string) {
    return this.userCollection(topicId);
  }

  userCollection(topicId) {
    return this.firestore.collection('users', ref => ref.where("topicId", '==', topicId))
  }

  getUser(id: string): any {
    return this.firestore.collection('users').doc(id).valueChanges();
  }
}

