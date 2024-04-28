import html from "./TextQ.component.html";
import css from "./TextQ.component.css";
import { QuestionBody } from "../../EzComponent_subclasses";
import { Term } from "../../database";
import { MainComponent } from "../main.component";
import { QuestionComponent } from "../question/question.component";

export class TextQComponent extends QuestionBody {
    constructor(term: Term, parent: QuestionComponent, main: MainComponent) {
        super(term, parent, main, html, css);
    }
}
