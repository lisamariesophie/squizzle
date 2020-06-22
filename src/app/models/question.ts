export class Question {
    id: string;
    img?: string;
    type: number;
    name: string;
    answers: string[];
    correct?: number;
    selectedAnswer?: number;
    points: number;
    hint?: string;
}
