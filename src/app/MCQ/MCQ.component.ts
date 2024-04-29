import html from "./MCQ.component.html";
import css from "./MCQ.component.css";
import { QuestionBody } from "../../EzComponent_subclasses";
import { Set, Term } from "../../database";
import { QuestionComponent } from "../question/question.component";
import { MainComponent } from "../main.component";

export class MCQComponent extends QuestionBody {
    constructor(
        term: Term,
        sets: Set[],
        parent: QuestionComponent,
        main: MainComponent,
    ) {
        super(term, sets, parent, main, html, css);
        this.name = "Multiple Choice";
    }
}
