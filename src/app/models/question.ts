import { Answer } from './answer';

export class Question {
    id: string;
    img?: string;
    type: number;
    name: string;
    answers: string[];
    correct?: string[];
    // selectedAnswer?: number;
    points: number;
    hint?: string;
}
