import { Question } from './question.model';

export class Quiz {
    // settings: Settings; 
    isCorrected?: boolean = false;
    isSubmitted: boolean = false;
    score?: number;
    questions: Question[];
}
