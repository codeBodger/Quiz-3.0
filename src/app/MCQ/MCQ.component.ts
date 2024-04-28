import html from "./MCQ.component.html";
import css from "./MCQ.component.css";
import { QuestionBody } from "../../EzComponent_subclasses";
import { Term } from "../../database";
import { QuestionComponent } from "../question/question.component";
import { MainComponent } from "../main.component";

export class MCQComponent extends QuestionBody {
    constructor(term: Term, parent: QuestionComponent, main: MainComponent) {
        super(term, parent, main, html, css);
    }
}
