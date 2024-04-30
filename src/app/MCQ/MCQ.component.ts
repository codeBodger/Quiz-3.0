import html from "./MCQ.component.html";
import css from "./MCQ.component.css";
import { QuestionBody } from "../../EzComponent_subclasses";
import { Set, Term } from "../../database";
import { QuestionComponent } from "../question/question.component";
import { MainComponent } from "../main.component";
import { BindValue, Click } from "@gsilber/webez";

export class MCQComponent extends QuestionBody {
    protected name: "Multiple Choice" = "Multiple Choice";

    @BindValue("prompt")
    private prompt: string;
    @BindValue("set")
    private setName: string;

    @BindValue("ans0")
    private name0: string = "";
    @BindValue("ans1")
    private name1: string = "";
    @BindValue("ans2")
    private name2: string = "";
    @BindValue("ans3")
    private name3: string = "";

    private choices: [Term, Term, Term, Term];

    constructor(
        term: Term,
        set: Set,
        sets: Set[],
        parent: QuestionComponent,
        main: MainComponent,
    ) {
        super(term, set, sets, parent, main, html, css);
        this.prompt = term.prompt;
        this.setName = `In set: ${set.name}`;
        this.choices = this.getOptions();
        // Shuffle algorithm adapted from https://bost.ocks.org/mike/shuffle/compare.html
        let i: number = this.choices.length;
        while (i) {
            let ind = Math.floor(Math.random() * i--);
            let t = this.choices[i];
            this.choices[i] = this.choices[ind];
            this.choices[ind] = t;
        }
        this.name0 = this.choices[0].answer;
        this.name1 = this.choices[1].answer;
        this.name2 = this.choices[2].answer;
        this.name3 = this.choices[3].answer;
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
        this.term.update(
            this.term.matches(answer) === "exactly",
            this.name,
            this.main,
        );
    }
}
