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

/**
 * @description A button class to help with MatchQComponent
 * @class Button
 * @property {boolean} done Whether this button has been correctly matched
 * @property {Term} term The term this button is representing
 * @readonly @property {0 | 1 | 2} index The index of the button (i.e. top, middle, bottom)
 * @readonly @property {"answer" | "prompt"} type In the answer or prompt column; which to display
 */
class Button {
    public done = false;
    public term: Term = new Term();

    /**
     * @description Creates an instance of Button
     * @readonly @param {0 | 1 | 2} index See class docs
     * @readonly @param {"answer" | "prompt"} type See class docs
     * @private @readonly @param {MatchQComponent} component The component that's displaying the button
     * @memberof Button
     * @constructor
     */
    constructor(
        public readonly index: 0 | 1 | 2,
        public readonly type: "answer" | "prompt",
        private readonly component: MatchQComponent,
    ) {}

    /**
     * @description Gets if this button is the one that's clicked
     * @memberof Button
     * @type {boolean}
     */
    get clicked(): boolean {
        return this === this.component.clicked;
    }

    /**
     * @description Handle what happens when/if this button is clicked
     * @memberof Button
     * @returns {void}
     */
    click(): void {
        if (this.clicked) this.component.clicked = undefined;
        else if ((this.component.clicked?.type ?? this.type) === this.type)
            this.component.clicked = this;
        else this.component.answer(this);
        this.component.update();
    }
}

/**
 * @description A generator for the transforms used in `BindCSSClassToBooleanSRA()` on `MatchQComponent.answers/prompts`
 * @param {"done" | "clicked"} value What to check about the button (what CSS class we're interested in)
 * @param {0 | 1 | 2} index Which button to look at
 * @returns {(v: Button[]): boolean}
 */
function transform(
    value: "done" | "clicked",
    index: 0 | 1 | 2,
): (v: Button[]) => boolean {
    return (v: Button[]) => {
        return v[index][value];
    };
}

/**
 * @description A class for handling all of the behaviour related to the MatchQ question type
 * @class Button
 * @extends QuestionBody
 * @property {Button | undefined} clicked The current button that's clicked
 */
export class MatchQComponent extends QuestionBody {
    /**
     * @description The 3-tuple storing the three answer buttons
     * @memberof MatchQComponent
     * @type {[Button, Button, Button]}
     * @private
     * @summary Is bound to the actual buttons in HTML s.t. they have the correct
     * character and styling
     * @NOTE For the decorators to take effect, you must do the example:
     * @example this.answers = [...this.answers]; // shallow copy, so the decorators update
     */
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

    /**
     * @description The 3-tuple storing the three prompt buttons
     * @memberof MatchQComponent
     * @type {[Button, Button, Button]}
     * @private
     * @summary Is bound to the actual buttons in HTML s.t. they have the correct
     * character and styling
     * @NOTE For the decorators to take effect, you must do the example:
     * @example this.prompts = [...this.prompts]; // shallow copy, so the decorators update
     */
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

    /**
     * @description Creates an instance of MatchQComponent
     * @param {Term} term The term we're testing the user on to start
     * @param {Set} set The set the term comes from, so we can update it
     * @param {Set[]} sets The sets the user is studying, so we can go to another term
     * @param {QuestionComponent} parent The parent component, for additional handling
     * @memberof MatchQComponent
     * @constructor
     */
    constructor(term: Term, set: Set, sets: Set[], parent: QuestionComponent) {
        super("Matching", term, set, sets, parent, html, css);
        let choices = this.getOptions();
        for (let i = 0; i < choices.length; i++)
            this.answers[i].term = choices[i];
        /**Shuffle algorithm adapted from https://bost.ocks.org/mike/shuffle/compare.html */
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

    /**
     * @description Get the three (other two) terms for use in matching
     * @memberof MatchQComponent
     * @returns {[Term, Term, Term]}
     * @throws {Error} If we somehow didn't catch that there weren't enough terms (maybe should be `EzError`?)
     */
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

    /**
     * @description See the examples for this.answers and this.prompts
     * @memberof MatchQComponent
     * @returns {void}
     */
    update(): void {
        this.answers = [...this.answers];
        this.prompts = [...this.prompts];
    }

    /**
     * @description Called when one of the answer buttons is pressed, calls `.click()` on that button
     * @memberof MatchQComponent
     * @param {MouseEventSRA} e The event created when the button is pressed, includes the id of the decorator
     * @returns {void}
     */
    @ClickSRA("ans0")
    @ClickSRA("ans1")
    @ClickSRA("ans2")
    actA(e: MouseEventSRA): void {
        this.answers[parseInt(e.idSRA.at(-1)!)].click();
    }
    /**
     * @description Called when one of the prompt buttons is pressed, calls `.click()` on that button
     * @memberof MatchQComponent
     * @param {MouseEventSRA} e The event created when the button is pressed, includes the id of the decorator
     * @returns {void}
     */
    @ClickSRA("pro0")
    @ClickSRA("pro1")
    @ClickSRA("pro2")
    actP(e: MouseEventSRA): void {
        this.prompts[parseInt(e.idSRA.at(-1)!)].click();
    }

    /**
     * @description Handles everything that needs to happen when an answer is given
     * @memberof MatchQComponent
     * @param {Button} expect The button that was pressed, to be checked agains this.clicked
     * @returns {void}
     */
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

    /**
     * @description Checks to see if all of the buttons are done
     * @memberof MatchQComponent
     * @returns {boolean}
     * @summary Actually checks if all buttons in either cattegory are done, though that
     * should always result in all buttons being done
     */
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
