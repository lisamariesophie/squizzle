import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  constructor() { }


  addQuestion(topic) {
    let topics = JSON.parse(localStorage.getItem('Topics'));
    topics.push();
    localStorage.setItem('Topics', JSON.stringify(topics));
  }
}
