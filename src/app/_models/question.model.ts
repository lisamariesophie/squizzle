export class Answer {
    value: string;
    correct: boolean;
}

export class Question {
    id: string;
    img?: string;
    type: number;
    name: string;
    answers: Array<Answer>;
    points?: number;
    hint?: string = "";
    hintOpened?: boolean = false;
    gapText?: Array<any>;
    imgUrl?: string;
    userScore?: number;
}
