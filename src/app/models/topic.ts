import { Quiz } from './quiz';
import { Settings } from './settings';

export class Topic {
    id: string;
    name: string;
    live: boolean = false;
    subtopics?: Topic[];  
    quiz: Quiz;  
    settings?: Settings;
}
