import { Subtopic } from './subtopic';
import { Quiz } from './quiz';

export class Topic {
    id: string;
    live: boolean = false;
    name: string;
    subtopics?: Subtopic[];  
    quiz: Quiz;  
}
