import html from "./CharQ.component.html";
import css from "./CharQ.component.css";
import { QuestionBody } from "../../EzComponent_subclasses";
import { Term, Set } from "../../database";
import { QuestionComponent } from "../question/question.component";
import { MainComponent } from "../main.component";
import { BindCSSClassToBooleanSRA } from "../../bind.decorators";
import { BindValue, Click } from "@gsilber/webez";
import { EzError } from "../EzError/EzError.component";

class Button {
    public char = "";
    public failed = false;

    constructor(private readonly component: CharQComponent) {}

    update(char: string): void {
        this.char = char;
        this.failed = false;
    }

    check(char: string): boolean {
        return !(this.failed = char !== this.char);
    }
}

function transform(index: 0 | 1 | 2 | 3 | 4 | 5 | 6): (v: Button[]) => boolean {
    return (v: Button[]) => v[index].failed;
}

export class CharQComponent extends QuestionBody {
    @BindValue("ans0", (v: Button[]) => v[0].char)
    @BindValue("ans1", (v: Button[]) => v[1].char)
    @BindValue("ans2", (v: Button[]) => v[2].char)
    @BindValue("ans3", (v: Button[]) => v[3].char)
    @BindValue("ans4", (v: Button[]) => v[4].char)
    @BindValue("ans5", (v: Button[]) => v[5].char)
    @BindValue("ans6", (v: Button[]) => v[6].char)
    @BindCSSClassToBooleanSRA("ans0", "wrong", transform(0))
    @BindCSSClassToBooleanSRA("ans1", "wrong", transform(1))
    @BindCSSClassToBooleanSRA("ans2", "wrong", transform(2))
    @BindCSSClassToBooleanSRA("ans3", "wrong", transform(3))
    @BindCSSClassToBooleanSRA("ans4", "wrong", transform(4))
    @BindCSSClassToBooleanSRA("ans5", "wrong", transform(5))
    @BindCSSClassToBooleanSRA("ans6", "wrong", transform(6))
    // @BindCSSClassToBooleanSRA("ans0", "unimplemented", transform(0))
    // @BindCSSClassToBooleanSRA("ans1", "unimplemented", transform(1))
    // @BindCSSClassToBooleanSRA("ans2", "unimplemented", transform(2))
    // @BindCSSClassToBooleanSRA("ans3", "unimplemented", transform(3))
    // @BindCSSClassToBooleanSRA("ans4", "unimplemented", transform(4))
    // @BindCSSClassToBooleanSRA("ans5", "unimplemented", transform(5))
    // @BindCSSClassToBooleanSRA("ans6", "unimplemented", transform(6))
    private answers: [Button, Button, Button, Button, Button, Button, Button] =
        [
            new Button(this),
            new Button(this),
            new Button(this),
            new Button(this),
            new Button(this),
            new Button(this),
            new Button(this),
        ];

    private index = 0;

    constructor(
        term: Term,
        set: Set,
        sets: Set[],
        parent: QuestionComponent,
        main: MainComponent,
    ) {
        super("Character Entry", term, set, sets, parent, main, html, css);
        this.updateButtons();
        this.update();
    }

    private get charNow(): string {
        return CharQComponent.buttonify(this.term.answer.charAt(this.index));
    }

    updateButtons(): void {
        let validChars = this.set.allChars.filter(
            (v: string) => v !== this.charNow,
        );
        if (validChars.length < 7)
            throw new EzError(
                `There are insufficient unique characters in the set "${this.set.name}".`,
            );
        for (let answer of this.answers) {
            const ind = Math.floor(Math.random() * validChars.length);
            answer.update(validChars[ind]);
            validChars[ind] = validChars[validChars.length - 1];
            validChars.pop();
        }
        this.answers[Math.floor(Math.random() * 7)].update(this.charNow);
    }

    update(): void {
        if (this.index >= this.term.answer.length) this.parent.continue();
        this.answers = [...this.answers];
        this.parent.prompt = `${this.term.prompt} ⇒&nbsp;${this.term.answer.slice(0, this.index)}`;
    }

    @Click("ans0")
    act0(): void {
        // this.answers[0].click(this.charNow);
        this.answer(this.answers[0]);
    }
    @Click("ans1")
    act1(): void {
        // this.answers[1].click(this.charNow);
        this.answer(this.answers[1]);
    }
    @Click("ans2")
    act2(): void {
        // this.answers[2].click(this.charNow);
        this.answer(this.answers[2]);
    }
    @Click("ans3")
    act3(): void {
        // this.answers[3].click(this.charNow);
        this.answer(this.answers[3]);
    }
    @Click("ans4")
    act4(): void {
        // this.answers[4].click(this.charNow);
        this.answer(this.answers[4]);
    }
    @Click("ans5")
    act5(): void {
        // this.answers[5].click(this.charNow);
        this.answer(this.answers[5]);
    }
    @Click("ans6")
    act6(): void {
        // this.answers[6].click(this.charNow);
        this.answer(this.answers[6]);
    }

    answer(expect: Button): void {
        const correct = expect.check(this.charNow);
        this.term.update(correct, this.type, this.main);
        if (correct) {
            this.index++;
            this.updateButtons();
        }
        this.update();
    }

    static buttonify(char: string): string {
        return char.toLocaleUpperCase().replace(/(\s)+/, "&nbsp;");
    }
}
