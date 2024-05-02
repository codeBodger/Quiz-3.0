import html from "./TextQ.component.html";
import css from "./TextQ.component.css";
import { QuestionBody } from "../../EzComponent_subclasses";
import { Set, Term } from "../../database";
import { MainComponent } from "../main.component";
import { QuestionComponent } from "../question/question.component";
import { Change, Click, ValueEvent } from "@gsilber/webez";

export class TextQComponent extends QuestionBody {
    private input: string = "";

    constructor(
        term: Term,
        set: Set,
        sets: Set[],
        parent: QuestionComponent,
        main: MainComponent,
    ) {
        super("Text Entry", term, set, sets, parent, main, html, css);
    }

    @Change("answer")
    update(e: ValueEvent): void {
        this.input = e.value;
    }

    @Click("submit")
    answer(): void {
        const correct = this.term.answer === this.input;
        this.term.update(correct, this.name, this.main);
        this.parent.answer(correct, this.input);
    }
}
