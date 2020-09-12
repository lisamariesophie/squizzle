import { User } from './user';

export class Topic {
    id?: string;
    localId?: string;
    authorUID?: string;
    name: string;
    live: boolean = false;
    quiz?: Quiz;
    users?: User[];
}

export class Quiz { 
    isCorrected?: boolean = false;
    isSubmitted: boolean = false;
    score?: number;
    questions: Question[];
}

export class Question {
    id: string;
    type: number;
    name: string;
    imgUrl?: string;
    answers: Array<Answer>;
    textAnswer?: string;
    isCorrected?: boolean = false;
    textAnswerCorrected?: string;
    points?: number;
    hint?: string = "";
    hintOpened?: boolean = false;
    gapText?: Array<any>;
    userScore?: number;
}

export class Answer {
    value: string;
    correct?: boolean;
    checked?: boolean = false;
}

export class GapText {
    id: number;
    type: string;
    value: string;
}

