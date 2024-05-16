import html from "./MCQ.component.html";
import css from "./MCQ.component.css";
import { QuestionBody } from "../../EzComponent_subclasses";
import { Set, Term } from "../../database";
import { QuestionComponent } from "../question/question.component";
import { BindValue } from "@gsilber/webez";
import { ClickSRA, MouseEventSRA } from "../../decoratorsSRA";

/**
 * @description A class for handling all of the behaviour related to the MCQ question type
 * @class MCQComponent
 * @extends {QuestionBody}
 */
export class MCQComponent extends QuestionBody {
    /**
     * @description The 4-tuple to store the terms for each button
     * @memberof MCQComponent
     * @type {[Term, Term, Term, Term]}
     * @private
     * @summary Is bound to the actual buttons in HTML s.t. they have the correct text
     * @NOTE For the decorators to take effect, you must do the example:
     * @example this.choices = [...this.choices]; // shallow copy, so the decorators update
     */
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

    /**
     * @description Creates an instance of MCQComponent
     * @param {Term} term The term being studied
     * @param {Set} set The set from which the term comes
     * @param {Set[]} sets The sets the being studied, so we can go to another term
     * @param {QuestionComponent} parent The parent component, for additional handling
     * @memberof MCQComponent
     * @constructor
     */
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

    /**
     * @description Get the four (other three) terms for the multiple choice
     * @memberof MCQComponent
     * @returns {[Term, Term, Term, Term]}
     */
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

    /**
     * @description Called when one of the choice buttons is pressed, deals with giving `answer()` the right info
     * @memberof MCQComponent
     * @param {MouseEventSRA} e The event created when the button is pressed, includes the id of the decorator
     * @returns {void}
     */
    @ClickSRA("ans0")
    @ClickSRA("ans1")
    @ClickSRA("ans2")
    @ClickSRA("ans3")
    act(e: MouseEventSRA): void {
        this.answer(this.choices[parseInt(e.idSRA.at(-1)!)]);
    }

    /**
     * @description Handles everything that needs to happen when a button is pressed
     * @memberof MCQComponent
     * @param {Term} expect The term corresponding to the button that was pressed
     * @returns {void}
     */
    answer(expect: Term): void {
        const correct = this.term.matches(expect).answer;
        this.term.update(correct, this.type, this.main);
        this.parent.answer(correct, expect.answer);
    }
}
