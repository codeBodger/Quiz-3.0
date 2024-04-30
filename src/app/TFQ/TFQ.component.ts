import html from "./TFQ.component.html";
import css from "./TFQ.component.css";
import { QuestionBody } from "../../EzComponent_subclasses";
import { Set, Term } from "../../database";
import { MainComponent } from "../main.component";
import { QuestionComponent } from "../question/question.component";

export class TFQComponent extends QuestionBody {
    constructor(
        term: Term,
        set: Set,
        sets: Set[],
        parent: QuestionComponent,
        main: MainComponent,
    ) {
        super("True/False", term, set, sets, parent, main, html, css);
    }
}
