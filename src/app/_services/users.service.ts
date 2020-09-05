import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  userRef: AngularFirestoreCollection<User> = null;

  constructor(private firestore: AngularFirestore) {
    this.userRef = this.firestore.collection('users', ref => ref.orderBy('email', "desc"));
  }

  // get all users
  getUsers() {
    return this.userRef;
  }

  // get user by id
  getUser(uid: string): any {
    return this.userRef.doc(uid).valueChanges();
  }

  getTopicsForUser(uid: string, topicId: string){
    return this.userRef.doc(uid).collection('topics').doc(topicId).valueChanges();
  }
  
}

