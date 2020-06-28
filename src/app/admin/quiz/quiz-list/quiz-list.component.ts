import { Component, OnInit, OnChanges, ChangeDetectorRef } from '@angular/core';
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
    private location: Location, protected modalService: NgbModal, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getTopic();
  }

  getTopic(): Topic {
    const id = this.route.snapshot.paramMap.get('id');
    this.topic = this.topicsService.getTopic(id);
    return this.topic;
  }

  get Topic() {
    return this.topic;
  }

  deleteQuestion(topic, question) {
    if (confirm('Sicher?'))
      this.topicsService.deleteQuestion(topic, question);
      this.cdr.detectChanges();
  }

  setLive(){
    this.topic = this.getTopic();
    this.topic.live = !this.topic.live;
    this.topicsService.updateTopic(this.topic);
  }

  goBack(): void {
    this.location.back();
  }

  openFormModal(id: string, type: string) {
    const modalRef = this.modalService.open(QuizCreateComponent, { ariaLabelledBy: 'create-quiz', backdrop: 'static', windowClass : "myCustomModalClass" });
    modalRef.componentInstance.topic = this.getTopic();
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.topicType = type;
    modalRef.result.then((result) => {
    }).catch((error) => {
    });
  }

}
