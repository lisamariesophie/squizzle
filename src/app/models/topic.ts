import { Quiz } from './quiz';

export class Topic {
    id: string;
    name: string;
    live: boolean = false;
    subtopics?: Topic[];  
    quiz: Quiz;  
}
