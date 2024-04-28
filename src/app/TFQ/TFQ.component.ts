import html from "./TFQ.component.html";
import css from "./TFQ.component.css";
import { QuestionBody } from "../../EzComponent_subclasses";
import { Term } from "../../database";
import { MainComponent } from "../main.component";
import { QuestionComponent } from "../question/question.component";

export class TFQComponent extends QuestionBody {
    constructor(term: Term, parent: QuestionComponent, main: MainComponent) {
        super(term, parent, main, html, css);
    }
}
