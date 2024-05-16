import html from "./CharQ.component.html";
import css from "./CharQ.component.css";
import { QuestionBody } from "../../EzComponent_subclasses";
import { Term, Set } from "../../database";
import { QuestionComponent } from "../question/question.component";
import {
    BindCSSClassToBooleanSRA,
    ClickSRA,
    MouseEventSRA,
} from "../../decoratorsSRA";
import { BindValue } from "@gsilber/webez";

/**
 * @description A button class to help with CharQComponent
 * @class Button
 * @property {string} char The character for the button
 * @property {boolean} failed If the user has erroneously clicked this button
 * @example const b = new Button();
 */
class Button {
    public char = "";
    public failed = false;

    /**
     * @description Updates the values of the button so we don't need a new one each time
     * @param {string} char The character for the button
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
     * @param {string} char The character to check against this button
     * @returns {boolean} Whether or not the char matched
     * @memberof Button
     * @example const correct = b.check("H");
     */
    check(char: string): boolean {
        return !(this.failed = char !== this.char);
    }
}

/**
 * @description A generator for the transforms used in `BindCSSClassToBooleanSRA()` on `CharQComponent.answers`
 * @param {0 | 1 | 2 | 3 | 4 | 5 | 6} index The index of the button to bind to
 * @returns {(v: Button[]): boolean} A function to determine if the button should be displayed as "wrong"
 * @example
 * -⋮
 * -@BindCSSClassToBooleanSRA("ans4", "wrong", transform(4))
 * -⋮
 * -private answers: [Button, Button, Button, Button, Button, Button, Button] = [...];
 */
function transform(index: 0 | 1 | 2 | 3 | 4 | 5 | 6): (v: Button[]) => boolean {
    return (v: Button[]) => v[index].failed;
}

/**
 * @description A class for handling all of the behaviour related to the CharQ question type
 * @class CharQComponent
 * @extends {QuestionBody}
 */
export class CharQComponent extends QuestionBody {
    /**
     * @description The 7-tuple storing the seven character buttons
     * @memberof CharQComponent
     * @type {[Button, Button, Button, Button, Button, Button, Button]}
     * @private
     * @summary Is bound to the actual buttons in HTML s.t. they have the correct
     * character and styling
     * @NOTE For the decorators to take effect, you must do the example:
     * @example this.answers = [...this.answers]; // shallow copy, so the decorators update
     */
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
            new Button(),
            new Button(),
            new Button(),
            new Button(),
            new Button(),
            new Button(),
            new Button(),
        ];

    /**
     * @description The current location in the term answer
     * @memberof CharQComponent
     * @type {number}
     * @private
     */
    private index: number = 0;

    /**
     * @description Creates an instance of CharQComponent
     * @param {Term} term The term we're testing the user on
     * @param {Set} set The set the term comes from, so we can update it
     * @param {Set[]} sets The sets the user is studying, so we can go to another term
     * @param {QuestionComponent} parent The parent component, for additional handling
     * @memberof CharQComponent
     * @constructor
     */
    constructor(term: Term, set: Set, sets: Set[], parent: QuestionComponent) {
        super("Character Entry", term, set, sets, parent, html, css);
        this.updateButtons();
        this.update();
    }

    /**
     * @description Gets the character we're interested in now and readies it for the button
     * @memberof CharQComponent
     * @type {string}
     * @private
     * @example const correct = expect.check(this.charNow);
     */
    private get charNow(): string {
        return CharQComponent.buttonify(this.term.answer.charAt(this.index));
    }

    /**
     * @description Updates the buttons with the new chars if the user was correct
     * @memberof CharQComponent
     * @returns {void}
     */
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

    /**
     * @description Causes the buttons to actually update
     * @memberof CharQComponent
     * @returns {void}
     */
    update(): void {
        if (this.index >= this.term.answer.length) this.parent.continue();
        this.answers = [...this.answers];
        this.parent.prompt = `${this.term.prompt} ⇒
            <span style="color: #467501;">${this.term.answer.slice(0, this.index)}</span>|`;
    }

    /**
     * @description Called when one of the buttons is pressed, deals with giving `answer()` the right info
     * @memberof CharQComponent
     * @param {MouseEventSRA} e The event created when the button is pressed, includes the id of the decorator
     * @returns {void}
     */
    @ClickSRA("ans0")
    @ClickSRA("ans1")
    @ClickSRA("ans2")
    @ClickSRA("ans3")
    @ClickSRA("ans4")
    @ClickSRA("ans5")
    @ClickSRA("ans6")
    act(e: MouseEventSRA): void {
        this.answer(this.answers[parseInt(e.idSRA.at(-1)!)]);
    }

    /**
     * @description Handles everything that needs to happen when the button is pressed
     * @memberof CharQComponent
     * @param {Button} expect The button that was pressed, to be checked against `this.charNow` for correctness
     * @returns {void}
     */
    answer(expect: Button): void {
        const correct = expect.check(this.charNow);
        this.term.update(correct, this.type, this.main);
        if (correct) {
            this.index++;
            this.updateButtons();
        }
        this.update();
    }

    /**
     * @description Turns a character into one that can be used by the buttons
     * @param {string} char The char to be turned
     * @returns {string} The turned char
     * @static
     */
    static buttonify(char: string): string {
        return char.toLocaleUpperCase().replace(/(\s)+/, "&nbsp;");
    }
}
