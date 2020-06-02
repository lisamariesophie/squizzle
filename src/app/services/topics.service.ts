import { Injectable } from '@angular/core';
import { InitTheme } from '../admin/theme/init-theme';
import { Topic } from '../models/topic';
import { Question } from '../models/question';

@Injectable({
  providedIn: 'root'
})
export class TopicsService extends InitTheme {

  constructor() {
    super();
    if (localStorage.getItem('Topics') === null) {
      console.log('No Topics Found...Creating Localstorage Item');
      let topics = [];
      localStorage.setItem('Topics', JSON.stringify(topics));
      return;
    }

    else {
      console.log('Found Topics...', localStorage);
    }
  }

  getTopics(): Topic[] {
    let localStorageItem = JSON.parse(localStorage.getItem('Topics'));
    return localStorageItem == null ? [] : localStorageItem;
  }

  getTopic(id: string): Topic {
    let topics = JSON.parse(localStorage.getItem('Topics'));
    return topics.find(x => x.id === id);
  }

  createTopic(newTopic: Topic) {
    const topics = JSON.parse(localStorage.getItem('Topics'));
    topics.push(newTopic);
    localStorage.setItem('Topics', JSON.stringify(topics));
  }

  deleteTopic(id: string) {
    let topics = JSON.parse(localStorage.getItem('Topics'));
    const i = topics.findIndex(x => x.id === id);
    topics.splice(i, 1);
    localStorage.setItem('Topics', JSON.stringify(topics));
  }

  updateTopic(topic: Topic, id: string, type: string, question: Question) {
    let topics = JSON.parse(localStorage.getItem('Topics'));
    if (type === 'topic') {
      const i = topics.findIndex(x => x.id === id);
      topics[i].quiz.questions.push(question);
      localStorage.setItem('Topics', JSON.stringify(topics));
    }
    else if (type === 'subtopic') {
      const i = topics.findIndex(x => x.id === topic.id);
      const j = topics[i].subtopics.findIndex(x => x.id === id);
      topics[i].subtopics[j].quiz.questions.push(question);
      localStorage.setItem('Topics', JSON.stringify(topics));
    }
  }

  deleteQuestion(topic: Topic, question: Question) {
    console.log('DELETE', topic)
    let topics = JSON.parse(localStorage.getItem('Topics'));
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].name == topic.name) {
        for (let j = 0; j < topics[i].quiz.questions.length; j++) {
          if (topics[i].quiz.questions[j].name == question.name) {
            topics[i].quiz.questions.splice(j, 1);
          }
        }
      }
      else {
        for (let j = 0; j < topics[i].subtopics.length; j++) {
          if (topics[i].subtopics[j].name == topic.name) {
            topics[i].subtopics[j].quiz.questions.splice(i, 1);
          }
        }
      }
    }
    localStorage.setItem('Topics', JSON.stringify(topics));
  }

}
