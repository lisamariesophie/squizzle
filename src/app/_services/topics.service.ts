import { Injectable } from '@angular/core';
import { Topic } from '../_models/topic.model';
import { Question } from '../_models/question.model';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable({
  providedIn: 'root'
})
export class TopicsService {

  constructor(private storage: LocalStorageService) {
    if (this.getTopics() === null) {
      const topics = [];
      this.storage.store('Topics', topics);
      return;
    }
    else {
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

  updateTopic(topic: Topic) {
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

  updateQuestions(topic: Topic, type: string, question: Question) {
    const topics = this.getTopics();
    const i = topics.findIndex(x => x.id === topic.id);
    topics[i].quiz.questions.push(question);
    this.storage.store('Topics', topics);
  }

  deleteQuestion(topic: Topic, question: Question) {
    const topics = this.getTopics();
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].id === topic.id) {
        for (let j = 0; j < topics[i].quiz.questions.length; j++) {
          if (topics[i].quiz.questions[j].name === question.name) {
            topics[i].quiz.questions.splice(j, 1);
          }
        }
      }
    }
    this.storage.store('Topics', topics);
  }
}
