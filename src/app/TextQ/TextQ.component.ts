import html from "./TextQ.component.html";
import css from "./TextQ.component.css";
import { QuestionBody } from "../../EzComponent_subclasses";
import { Set, Term } from "../../database";
import { QuestionComponent } from "../question/question.component";
import { Click, GenericEvent, Input, ValueEvent } from "@gsilber/webez";

export class TextQComponent extends QuestionBody {
    private input: string = "";

    constructor(term: Term, set: Set, sets: Set[], parent: QuestionComponent) {
        super("Text Entry", term, set, sets, parent, html, css);
    }

    @Input("answer")
    update(e: ValueEvent): void {
        this.input = e.value;
    }

    @Click("submit")
    @GenericEvent("answer", "keyup")
    answer(e: KeyboardEvent | MouseEvent): void {
        if (e instanceof KeyboardEvent && e.key !== "Enter") return;
        const correct = this.term.answer === this.input;
        this.term.update(correct, this.type, this.main);
        this.parent.answer(correct, this.input);
    }
}
