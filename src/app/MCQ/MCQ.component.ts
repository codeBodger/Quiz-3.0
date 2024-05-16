import html from "./MCQ.component.html";
import css from "./MCQ.component.css";
import { QuestionBody } from "../../EzComponent_subclasses";
import { Set, Term } from "../../database";
import { QuestionComponent } from "../question/question.component";
import { BindValue } from "@gsilber/webez";
import { ClickSRA, MouseEventSRA } from "../../decoratorsSRA";

export class MCQComponent extends QuestionBody {
    @BindValue("ans0", (v: Term[]) => v[0].answer)
    @BindValue("ans1", (v: Term[]) => v[1].answer)
    @BindValue("ans2", (v: Term[]) => v[2].answer)
    @BindValue("ans3", (v: Term[]) => v[3].answer)
    private choices: [Term, Term, Term, Term] = [
        new Term(),
        new Term(),
        new Term(),
        new Term(),
    ];

    constructor(term: Term, set: Set, sets: Set[], parent: QuestionComponent) {
        super("Multiple Choice", term, set, sets, parent, html, css);
        let choices = this.getOptions();
        // Shuffle algorithm adapted from https://bost.ocks.org/mike/shuffle/compare.html
        let i: number = choices.length;
        while (i) {
            let ind = Math.floor(Math.random() * i--);
            let t = choices[i];
            choices[i] = choices[ind];
            choices[ind] = t;
        }
        this.choices = choices;
    }

    getOptions(): [Term, Term, Term, Term] {
        let allOptions = this.term.allOptions(this.sets);
        if (allOptions.length < 3)
            throw new Error(
                "Oops!  We didn't catch that there weren't enough terms!",
            );

        let out: [Term, Term, Term, Term] = [
            this.term,
            this.term,
            this.term,
            this.term,
        ];
        for (let i = 1; i < 4; i++) {
            let ind = Math.floor(Math.random() * allOptions.length);
            out[i] = allOptions[ind];
            allOptions[ind] = allOptions[allOptions.length - 1];
            allOptions.pop();
        }
        return out;
    }

    @ClickSRA("ans0")
    @ClickSRA("ans1")
    @ClickSRA("ans2")
    @ClickSRA("ans3")
    act(e: MouseEventSRA): void {
        this.answer(this.choices[parseInt(e.idSRA.at(-1)!)]);
    }

    answer(answer: Term) {
        const correct = this.term.matches(answer).answer;
        this.term.update(correct, this.type, this.main);
        this.parent.answer(correct, answer.answer);
    }
}
