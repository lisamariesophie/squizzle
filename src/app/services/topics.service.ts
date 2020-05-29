import { Injectable } from '@angular/core';
import { InitTheme } from '../admin/theme/init-theme';

@Injectable({
  providedIn: 'root'
})
export class TopicsService extends InitTheme {

  constructor() {
    super();
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
    topics.push(newTopic);
    localStorage.setItem('Topics', JSON.stringify(topics));
  }

  deleteTopic(topic) {
    let topics = JSON.parse(localStorage.getItem('Topics'));
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].name == topic.name) {
        topics.splice(i, 1);
      }
    }
    localStorage.setItem('Topics', JSON.stringify(topics));
  }

  //unfinished --> Subtopic Questions not ideal
  updateQuestions(oldTopic, selectedTopicName, question) {
    let topics = JSON.parse(localStorage.getItem('Topics'));
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].name == selectedTopicName) {
        topics[i].subtopics = Object.assign(oldTopic.subtopics);
        if (oldTopic.quiz.questions !== null) {
          topics[i].quiz.questions = Object.assign(oldTopic.quiz.questions);
          topics[i].quiz.questions.push(question);
        } else {
          topics[i].quiz.questions.push(question);
        }
      } else {
        for (let j = 0; j < topics[i].subtopics.length; j++) {
          if (topics[i].subtopics[j].name == selectedTopicName) {
            topics[i].subtopics[j].quiz.questions.push(question);
          }
        }
      }
    }
    localStorage.setItem('Topics', JSON.stringify(topics));
  }

  deleteQuestion(topic, question) {
    console.log('DELETE', topic)
    let topics = JSON.parse(localStorage.getItem('Topics'));
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].name == topic.name) {
        console.log('Found Topic', topics[i]);
        console.log(topics[i].quiz.questions.length)
        for (let j = 0; j < topics[i].quiz.questions.length; j++) {
          if (topics[i].quiz.questions[j].name == question.name) {
            console.log('Found Question')
            topics[i].quiz.questions.splice(j, 1);
            console.log(topics[i].quiz.questions[j])
          }
        }
      }
      else {
        console.log('Found Subtopic');
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
