import { Injectable } from '@angular/core';
import { InitTheme } from '../admin/theme/init-theme';
import { Topic } from '../models/topic';
import { Question } from '../models/question';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable({
  providedIn: 'root'
})
export class TopicsService extends InitTheme {

  constructor(private storage: LocalStorageService) {
    super();
    if (this.getTopics() === null) {
      console.log('No Topics Found...Creating Localstorage');
      const topics = [];
      this.storage.store('Topics', topics);
      return;
    }
    else {
      console.log('Found Topics...', this.getTopics());
    }
  }

  getTopics() {
    return this.storage.retrieve('Topics');
  }

  getTopic(id: string): Topic {
    const topics = this.getTopics();
    return topics.find(x => x.id === id);
  }

  createTopic(newTopic: Topic) {
    const topics = this.getTopics();
    topics.push(newTopic);
    this.storage.store('Topics', topics);
  }

  updateTopic(topic: Topic){
    const topics = this.getTopics();
    const i = topics.findIndex(x => x.id === topic.id);
    topics[i] = topic;
    this.storage.store('Topics', topics);
  }

  deleteTopic(id: string) {
    const topics = this.getTopics();
    const i = topics.findIndex(x => x.id === id);
    topics.splice(i, 1);
    this.storage.store('Topics', topics);
  }

  updateQuestions(topic: Topic, id: string, type: string, question: Question) {
    const topics = this.getTopics();
    if (type === 'topic') {
      const i = topics.findIndex(x => x.id === id);
      topics[i].quiz.questions.push(question);
      this.storage.store('Topics', topics);
    }
    else if (type === 'subtopic') {
      const i = topics.findIndex(x => x.id === topic.id);
      const j = topics[i].subtopics.findIndex(x => x.id === id);
      topics[i].subtopics[j].quiz.questions.push(question);
      this.storage.store('Topics', topics);
    }
  }

  deleteQuestion(topic: Topic, question: Question) {
    const topics = this.getTopics();
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].name === topic.name) {
        for (let j = 0; j < topics[i].quiz.questions.length; j++) {
          if (topics[i].quiz.questions[j].name === question.name) {
            topics[i].quiz.questions.splice(j, 1);
          }
        }
      }
      else {
        for (let j = 0; j < topics[i].subtopics.length; j++) {
          if (topics[i].subtopics[j].name === topic.name) {
            topics[i].subtopics[j].quiz.questions.splice(i, 1);
          }
        }
      }
    }
    this.storage.store('Topics', topics);
  }
}
