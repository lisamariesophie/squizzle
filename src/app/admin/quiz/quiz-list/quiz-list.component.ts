import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { TopicsService } from 'src/app/services/topics.service';
import { Topic } from 'src/app/models/topic';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuizCreateComponent } from '../quiz-create/quiz-create.component';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss']
})
export class QuizListComponent implements OnInit {

  topic: Topic;

  constructor(private route: ActivatedRoute,
    private topicsService: TopicsService,
    private location: Location, protected modalService: NgbModal) { }

  ngOnInit(): void {
    this.getTopic();
  }

  getTopic(): Topic {
    const name = this.route.snapshot.paramMap.get('name');
    this.topic = this.topicsService.getTopic(name);
    return this.topic;
  }

  get Topic() {
    return this.topic;
  }

  deleteQuestion(topic, question) {
    if (confirm('Sicher?'))
      this.topicsService.deleteQuestion(topic, question);
  }

  goBack(): void {
    this.location.back();
  }

  openFormModal(selectedTopicName) {
    const modalRef = this.modalService.open(QuizCreateComponent, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static' });
    modalRef.componentInstance.topic = this.getTopic();
    modalRef.componentInstance.selectedTopicName = selectedTopicName;
    modalRef.result.then((result) => {
    }).catch((error) => {
    });
  }

}
