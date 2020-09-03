import { Question } from './question.model';

export class Quiz {
    // settings: Settings; 
    submitted: boolean = false;
    questions: Question[];
    score?: number;
}
