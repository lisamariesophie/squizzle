export class Question {
    id: string;
    type: number;
    name: string;
    answers: string[];
    correct?: string;
    points: number;
    hint?: string;
}
