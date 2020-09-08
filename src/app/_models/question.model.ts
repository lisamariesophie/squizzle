export class Answer {
    value: string;
    correct?: boolean;
    checked?: boolean = false;
}

export class Question {
    id: string;
    img?: string;
    type: number;
    name: string;
    answers: Array<Answer>;
    textAnswer?: string;
    isCorrected?: boolean = false;
    textAnswerCorrected?: string;
    points?: number;
    hint?: string = "";
    hintOpened?: boolean = false;
    gapText?: Array<any>;
    imgUrl?: string;
    userScore?: number;
    
}
