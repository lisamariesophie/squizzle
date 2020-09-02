import { Quiz } from './quiz.model';
import { User } from './user';

export class Topic {
    id?: string;
    authorUID: string;
    name: string;
    live: boolean = false;
    quiz?: Quiz;
    users?: User[];
}