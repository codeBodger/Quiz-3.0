import html from "./TFQ.component.html";
import css from "./TFQ.component.css";
import { QuestionBody } from "../../EzComponent_subclasses";
import { Set, Term } from "../../database";
import { MainComponent } from "../main.component";
import { QuestionComponent } from "../question/question.component";
import { Click } from "@gsilber/webez";

type TF = { prompt: Term; answer: Term };

export class TFQComponent extends QuestionBody {
    private choices: TF;

    constructor(
        term: Term,
        set: Set,
        sets: Set[],
        parent: QuestionComponent,
        main: MainComponent,
    ) {
        super("True/False", term, set, sets, parent, main, html, css);
        this.choices = { prompt: term, answer: term };
        if (Math.random() < 0.5) {
            let allOptions = this.term.allOptions(this.sets);
            if (allOptions.length < 1)
                throw new Error(
                    "Oops!  We didn't catch that there weren't enough terms!",
                );

            const i = Math.floor(Math.random() * allOptions.length);
            this.choices.answer = allOptions[i];
        }
        this.parent.prompt = `${this.choices.prompt.prompt} ⇒ ${this.choices.answer.answer}`;
    }

    @Click("true")
    ansTrue(): void {
        this.answer(true);
    }
    @Click("false")
    ansFalse(): void {
        this.answer(false);
    }

    answer(expect: boolean): void {
        const correct =
            (this.choices.prompt.matches(this.choices.answer) === "exactly") ===
            expect;
        this.term.update(correct, this.type, this.main);
        this.parent.answer(correct, expect ? "True" : "False");
    }
}
