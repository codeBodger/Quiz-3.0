import html from "./CharQ.component.html";
import css from "./CharQ.component.css";
import { QuestionBody } from "../../EzComponent_subclasses";
import { Term, Set } from "../../database";
import { QuestionComponent } from "../question/question.component";
import { MainComponent } from "../main.component";
import {
    BindCSSClassToBooleanSRA,
    ClickSRA,
    MouseEventSRA,
} from "../../decoratorsSRA";
import { BindValue } from "@gsilber/webez";

/**
 * @description A button class to help with CharQComponent
 * @class Button
 * @example const b = new Button(this);
 */
class Button {
    public char = "";
    public failed = false;

    /**
     * @description Creates an instance of Button
     * @param {CharQComponent} [component] The component to which to attach this button
     * @memberof Button
     * @public
     * @constructor
     * @example const b = new Button(this);
     */
    constructor(private readonly component: CharQComponent) {}

    /**
     * @description Updates the values of the button so we don't need a new one each time
     * @param char The character for the button
     * @returns void
     * @memberof Button
     * @example b.update("H");
     */
    update(char: string): void {
        this.char = char;
        this.failed = false;
    }

    /**
     * @description Checks if the given char matches this button and sets `this.failed` accordingly
     * @param char The character to check against this button
     * @returns {boolean} Whether or not the char matched
     * @memberof Button
     * @example const correct = b.check("H");
     */
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
            throw new Error(
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
        this.parent.prompt = `${this.term.prompt} ⇒
            <span style="color: #467501;">${this.term.answer.slice(0, this.index)}</span>|`;
    }

    @ClickSRA("ans0")
    @ClickSRA("ans1")
    @ClickSRA("ans2")
    @ClickSRA("ans3")
    @ClickSRA("ans4")
    @ClickSRA("ans5")
    @ClickSRA("ans6")
    act(e: MouseEventSRA): void {
        console.log(e.idSRA);
        this.answer(this.answers[parseInt(e.idSRA.at(-1)!)]);
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
