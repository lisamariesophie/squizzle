import { Quiz } from './quiz.model';

export class Topic {
    id?: string;
    name: string;
    live: boolean = false;
    quiz?: Quiz;
}