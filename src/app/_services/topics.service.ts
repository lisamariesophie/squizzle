import { Injectable } from '@angular/core';
import { Topic, Question } from '../_models/topic.model';
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
  }

  getTopics() {
    return this.storage.retrieve('Topics');
  }

  getTopic(id: string): Topic {
    const topics = this.getTopics();
    return topics.find(x => x.localId === id);
  }

  createTopic(newTopic: Topic) {
    const topics = this.getTopics();
    topics.push(newTopic);
    this.storage.store('Topics', topics);
  }

  updateTopic(topic: Topic) {
    const topics = this.getTopics();
    const i = topics.findIndex(x => x.localId === topic.id);
    topics[i] = topic;
    this.storage.store('Topics', topics);
  }

  deleteTopic(id: string) {
    const topics = this.getTopics();
    const i = topics.findIndex(x => x.localId === id);
    topics.splice(i, 1);
    this.storage.store('Topics', topics);
  }
}