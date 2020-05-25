import { Subtopic } from './subtopic';
import { Quiz } from './quiz';

export class Topic {
    id: string;
    name: string;
    subtopics?: Subtopic[];  
    quiz: Quiz;  
}
