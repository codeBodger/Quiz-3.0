import html from "./MatchQ.component.html";
import css from "./MatchQ.component.css";
import { QuestionBody } from "../../EzComponent_subclasses";
import { Term, Set } from "../../database";
import { QuestionComponent } from "../question/question.component";
import { BindValue } from "@gsilber/webez";
import {
    BindCSSClassToBooleanSRA,
    ClickSRA,
    MouseEventSRA,
} from "../../decoratorsSRA";

class Button {
    public done = false;
    public term: Term = new Term();

    constructor(
        public readonly index: 0 | 1 | 2,
        public readonly type: "answer" | "prompt",
        private readonly component: MatchQComponent,
    ) {}

    get clicked(): boolean {
        const yes = this === this.component.clicked;
        return yes;
    }

    click(): void {
        if (this.clicked) this.component.clicked = undefined;
        else if ((this.component.clicked?.type ?? this.type) === this.type)
            this.component.clicked = this;
        else this.component.answer(this);
        this.component.update();
    }
}

function transform(
    value: "done" | "clicked",
    index: 0 | 1 | 2,
): (v: Button[]) => boolean {
    return (v: Button[]) => {
        return v[index][value];
    };
}

export class MatchQComponent extends QuestionBody {
    @BindValue("ans0", (v: Button[]) => v[0].term.answer)
    @BindValue("ans1", (v: Button[]) => v[1].term.answer)
    @BindValue("ans2", (v: Button[]) => v[2].term.answer)
    @BindCSSClassToBooleanSRA("ans0", "done", transform("done", 0))
    @BindCSSClassToBooleanSRA("ans1", "done", transform("done", 1))
    @BindCSSClassToBooleanSRA("ans2", "done", transform("done", 2))
    @BindCSSClassToBooleanSRA("ans0", "clicked", transform("clicked", 0))
    @BindCSSClassToBooleanSRA("ans1", "clicked", transform("clicked", 1))
    @BindCSSClassToBooleanSRA("ans2", "clicked", transform("clicked", 2))
    private answers: [Button, Button, Button] = [
        new Button(0, "answer", this),
        new Button(1, "answer", this),
        new Button(2, "answer", this),
    ];

    @BindValue("pro0", (v: Button[]) => v[0].term.prompt)
    @BindValue("pro1", (v: Button[]) => v[1].term.prompt)
    @BindValue("pro2", (v: Button[]) => v[2].term.prompt)
    @BindCSSClassToBooleanSRA("pro0", "done", transform("done", 0))
    @BindCSSClassToBooleanSRA("pro1", "done", transform("done", 1))
    @BindCSSClassToBooleanSRA("pro2", "done", transform("done", 2))
    @BindCSSClassToBooleanSRA("pro0", "clicked", transform("clicked", 0))
    @BindCSSClassToBooleanSRA("pro1", "clicked", transform("clicked", 1))
    @BindCSSClassToBooleanSRA("pro2", "clicked", transform("clicked", 2))
    private prompts: [Button, Button, Button] = [
        new Button(0, "prompt", this),
        new Button(1, "prompt", this),
        new Button(2, "prompt", this),
    ];

    public clicked: Button | undefined = undefined;

    constructor(term: Term, set: Set, sets: Set[], parent: QuestionComponent) {
        super("Matching", term, set, sets, parent, html, css);
        let choices = this.getOptions();
        for (let i = 0; i < choices.length; i++)
            this.answers[i].term = choices[i];
        // Shuffle algorithm adapted from https://bost.ocks.org/mike/shuffle/compare.html
        let i: number = choices.length;
        while (i) {
            let ind = Math.floor(Math.random() * i--);
            let t = choices[i];
            choices[i] = choices[ind];
            choices[ind] = t;
        }
        for (let i = 0; i < choices.length; i++)
            this.prompts[i].term = choices[i];

        this.update();
        this.parent.prompt = "&nbsp;";
    }

    getOptions(): [Term, Term, Term] {
        let allOptions = this.term.allOptions([this.set]);
        if (allOptions.length < 2)
            throw new Error(
                "Oops!  We didn't catch that there weren't enough terms!",
            );

        let out: [Term, Term, Term] = [this.term, this.term, this.term];
        for (let i = 1; i < 3; i++) {
            let ind = Math.floor(Math.random() * allOptions.length);
            out[i] = allOptions[ind];
            allOptions[ind] = allOptions[allOptions.length - 1];
            allOptions.pop();
        }
        return out;
    }

    update(): void {
        this.answers = [...this.answers];
        this.prompts = [...this.prompts];
    }

    @ClickSRA("ans0")
    @ClickSRA("ans1")
    @ClickSRA("ans2")
    actA(e: MouseEventSRA): void {
        this.answers[parseInt(e.idSRA.at(-1)!)].click();
    }
    @ClickSRA("pro0")
    @ClickSRA("pro1")
    @ClickSRA("pro2")
    actP(e: MouseEventSRA): void {
        this.prompts[parseInt(e.idSRA.at(-1)!)].click();
    }

    answer(expect: Button): void {
        if (this.clicked?.type === expect.type || !this.clicked) return; // should never be the case
        const correct = this.clicked.term === expect.term;
        expect.term.update(correct, this.type, this.main);
        this.clicked.term.update(correct, this.type, this.main);
        if (correct) {
            expect.done = true;
            this.clicked.done = true;
        }
        this.clicked = undefined;
        if (this.checkAll()) this.parent.continue();
        this.update();
    }

    checkAll(): boolean {
        return (
            this.answers.reduce(
                (acc: boolean, v: Button) => acc && v.done,
                true,
            ) ||
            this.prompts.reduce(
                (acc: boolean, v: Button) => acc && v.done,
                true,
            )
        );
    }
}
