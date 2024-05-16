import html from "./NewQ.component.html";
import css from "./NewQ.component.css";
import { QuestionBody } from "../../EzComponent_subclasses";
import { Term, Set } from "../../database";
import { QuestionComponent } from "../question/question.component";
import { Click } from "@gsilber/webez";

export class NewQComponent extends QuestionBody {
    constructor(term: Term, set: Set, sets: Set[], parent: QuestionComponent) {
        super("New Term", term, set, sets, parent, html, css);
        this.parent.prompt = `${this.term.prompt} ⇒ ${this.term.answer}`;
    }

    @Click("confident")
    confident(): void {
        this.answer(true);
    }

    @Click("practice")
    practice(): void {
        this.answer(false);
    }

    answer(expect: boolean): void {
        this.term.update(expect, this.type, this.main);
        this.parent.continue();
    }
}
