import { GapText } from './gaptext.model';

export class Question {
    id: string;
    img?: string;
    type: number;
    name: string;
    answers: Array<string>;
    correct?: Array<string>;
    points?: number;
    hint?: string = "";
    gapText?: Array<any>;
    imgUrl?: string;
}
