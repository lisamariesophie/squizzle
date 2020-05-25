import { Injectable } from '@angular/core';
import { InitTheme } from '../admin/theme/init-theme';

@Injectable({
  providedIn: 'root'
})
export class TopicsService extends InitTheme {

  constructor() {
    super();
    console.log('TopicsService Works');
    this.load();
  }

  getTopics() {
    let topics = JSON.parse(localStorage.getItem('Topics'));
    return topics;
  }

  getTopic(name) {
    let topics = JSON.parse(localStorage.getItem('Topics'));
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].name == name) {
        return topics[i];
      }
    }
  }

  addTopic(newTopic) {
    let topics = JSON.parse(localStorage.getItem('Topics'));
    // Add New TodoService
    topics.push(newTopic);
    // Set New Todos
    localStorage.setItem('Topics', JSON.stringify(topics));
  }

  deleteTopic(topic) {
    let topics = JSON.parse(localStorage.getItem('Topics'));
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].name == topic.name) {
        topics.splice(i, 1);
      }
    }
    // Set New Todos
    localStorage.setItem('Topics', JSON.stringify(topics));
  }

  //unfinished
  updateTodo(oldTopic, newTopic) {
    let topics = JSON.parse(localStorage.getItem('Topics'));

    for (let i = 0; i < topics.length; i++) {
      if (topics[i].name == oldTopic) {
        topics[i].name = newTopic;
      }
    }
    // Set New Todos
    localStorage.setItem('Topics', JSON.stringify(topics));
  }

}
