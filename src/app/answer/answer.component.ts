import html from "./answer.component.html";
import css from "./answer.component.css";
import { SubComponent } from "../../EzComponent_subclasses";
import { QuestionComponent } from "../question/question.component";
import { MainComponent } from "../main.component";
import { Term } from "../../database";
import { BindStyle, BindValue, Click } from "@gsilber/webez";

export class AnswerComponent extends SubComponent {
    @BindStyle("correct", "color", (val: boolean) => (val ? "#218c64" : "red"))
    @BindValue("correct", (val: boolean) => (val ? "Correct!" : "Incorrect"))
    @BindStyle("corrected-message", "visibility", (val: boolean) =>
        val ? "hidden" : "visible",
    )
    private correct: boolean = true;

    @BindValue("answer")
    private answer: string = "";

    @BindValue("corrected")
    private corrected: string = "";

    constructor(
        private term: Term,
        protected parent: QuestionComponent,
        main: MainComponent,
    ) {
        super(parent, main, html, css);
    }

    init(correct: boolean, answer: string): void {
        this.correct = correct;
        this.answer = answer;
        this.corrected = this.term.answer;
    }

    @Click("continue")
    continue(): void {
        this.parent.continue();
    }
}
