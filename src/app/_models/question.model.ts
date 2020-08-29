import { GapText } from './gaptext.model';

export class Question {
    id: string;
    img?: string;
    type: number;
    name: string;
    answers: string[];
    correct?: string[];
    points?: number;
    hint?: string = "";
    gapText?: GapText[];
    imgUrl?: string;
}
