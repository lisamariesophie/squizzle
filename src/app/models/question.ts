import { Answer } from './answer';

export class Question {
    id: string;
    img?: string;
    type: number;
    name: string;
    answers: string[];
    correct?: string[];
    userAnswer?: number;
    points: number;
    hint?: string;
}
