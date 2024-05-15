import html from "./MatchQ.component.html";
import css from "./MatchQ.component.css";
import { QuestionBody } from "../../EzComponent_subclasses";
import { Term, Set } from "../../database";
import { MainComponent } from "../main.component";
import { QuestionComponent } from "../question/question.component";
import { BindValue, Click } from "@gsilber/webez";
import { BindCSSClassToBooleanSRA } from "../../decoratorsSRA";

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
    // ): (v: Button[]) => string {
    //     return (v: Button[]) => (v[index][value] ? value : "");
): (v: Button[]) => boolean {
    return (v: Button[]) => {
        return v[index][value];
    };
}

export class MatchQComponent extends QuestionBody {
    @BindValue("ans0", (v: Button[]) => v[0].term.answer)
    @BindValue("ans1", (v: Button[]) => v[1].term.answer)
    @BindValue("ans2", (v: Button[]) => v[2].term.answer)
    // @BindCSSClass("ans0", transform("done", 0))
    // @BindCSSClass("ans1", transform("done", 1))
    // @BindCSSClass("ans2", transform("done", 2))
    // @BindCSSClass("ans0", transform("clicked", 0))
    // @BindCSSClass("ans1", transform("clicked", 1))
    // @BindCSSClass("ans2", transform("clicked", 2))
    // @BindAttribute("ans0", "class", transform("done", 0))
    // @BindAttribute("ans1", "class", transform("done", 1))
    // @BindAttribute("ans2", "class", transform("done", 2))
    // @BindAttribute("ans0", "class", transform("clicked", 0))
    // @BindAttribute("ans1", "class", transform("clicked", 1))
    // @BindAttribute("ans2", "class", transform("clicked", 2))
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
    // @BindCSSClass("pro0", transform("done", 0))
    // @BindCSSClass("pro1", transform("done", 1))
    // @BindCSSClass("pro2", transform("done", 2))
    // @BindCSSClass("pro0", transform("clicked", 0))
    // @BindCSSClass("pro1", transform("clicked", 1))
    // @BindCSSClass("pro2", transform("clicked", 2))
    // @BindAttribute("pro0", "class", transform("done", 0))
    // @BindAttribute("pro1", "class", transform("done", 1))
    // @BindAttribute("pro2", "class", transform("done", 2))
    // @BindAttribute("pro0", "class", transform("clicked", 0))
    // @BindAttribute("pro1", "class", transform("clicked", 1))
    // @BindAttribute("pro2", "class", transform("clicked", 2))
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

    constructor(
        term: Term,
        set: Set,
        sets: Set[],
        parent: QuestionComponent,
        main: MainComponent,
    ) {
        super("Matching", term, set, sets, parent, main, html, css);
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

    @Click("ans0")
    actA0(): void {
        this.answers[0].click();
    }
    @Click("ans1")
    actA1(): void {
        this.answers[1].click();
    }
    @Click("ans2")
    actA2(): void {
        this.answers[2].click();
    }

    @Click("pro0")
    actP0(): void {
        this.prompts[0].click();
    }
    @Click("pro1")
    actP1(): void {
        this.prompts[1].click();
    }
    @Click("pro2")
    actP2(): void {
        this.prompts[2].click();
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
