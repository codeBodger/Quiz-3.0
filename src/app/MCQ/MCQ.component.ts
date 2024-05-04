import html from "./MCQ.component.html";
import css from "./MCQ.component.css";
import { QuestionBody } from "../../EzComponent_subclasses";
import { Set, Term } from "../../database";
import { QuestionComponent } from "../question/question.component";
import { MainComponent } from "../main.component";
import { BindValue, Click } from "@gsilber/webez";

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

    constructor(
        term: Term,
        set: Set,
        sets: Set[],
        parent: QuestionComponent,
        main: MainComponent,
    ) {
        super("Multiple Choice", term, set, sets, parent, main, html, css);
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
        let allOptions: Term[] = [];
        this.sets.forEach((set: Set) => {
            set.terms.forEach((term: Term) => {
                if (term.matches(this.term) === "none") allOptions.push(term);
            });
        });
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

    @Click("ans0")
    act1(): void {
        this.answer(this.choices[0]);
    }
    @Click("ans1")
    act2(): void {
        this.answer(this.choices[1]);
    }
    @Click("ans2")
    act3(): void {
        this.answer(this.choices[2]);
    }
    @Click("ans3")
    act4(): void {
        this.answer(this.choices[3]);
    }

    answer(answer: Term) {
        const correct = this.term.matches(answer) === "exactly";
        this.term.update(correct, this.type, this.main);
        this.parent.answer(correct, answer.answer);
    }
}
