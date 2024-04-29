import html from "./TextQ.component.html";
import css from "./TextQ.component.css";
import { QuestionBody } from "../../EzComponent_subclasses";
import { Set, Term } from "../../database";
import { MainComponent } from "../main.component";
import { QuestionComponent } from "../question/question.component";

export class TextQComponent extends QuestionBody {
    constructor(
        term: Term,
        sets: Set[],
        parent: QuestionComponent,
        main: MainComponent,
    ) {
        super(term, sets, parent, main, html, css);
    }
}
