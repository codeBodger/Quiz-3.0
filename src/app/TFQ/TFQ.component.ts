import html from "./TFQ.component.html";
import css from "./TFQ.component.css";
import { QuestionBody } from "../../EzComponent_subclasses";
import { Set, Term } from "../../database";
import { QuestionComponent } from "../question/question.component";
import { ClickSRA, MouseEventSRA } from "../../decoratorsSRA";

/**
 * @description Converts a string into a boolean, ignoring case, returns undefined if not "true" or "false"
 * @param {string} b The string to convert
 * @returns {boolean | undefined}
 */
function parseBoolean(b: string): boolean | undefined {
    b = b.toLocaleLowerCase();
    switch (b) {
        case "true":
            return true;
        case "false":
            return false;
        default:
            return undefined;
    }
}

/**
 * @description A type to hold the term for the prompt and for the answer
 * @property {Term} prompt The prompt we're asking if the answer matches
 * @property {Term} answer The answer we're asking if the prompt matches
 * @summary The two properties will have the same refferent if the correct choice is "True"
 */
type TF = { prompt: Term; answer: Term };

/**
 * @description A class for handling all of the behaviour related to the TFQ question type
 * @class TFQComponent
 * @extends {QuestionBody}
 */
export class TFQComponent extends QuestionBody {
    /**
     * @description The TF for storing the prompt and answer terms
     * @memberof TFQComponent
     * @type {TF}
     * @private
     */
    private choices: TF;

    /**
     * @description Creates an instance of TFQComponent
     * @param {Term} term The term we're testing the user on
     * @param {Set} set The set the term comes from, so we can update it
     * @param {Set[]} sets The sets the user is studying, so we can go to another term
     * @param {QuestionComponent} parent The parent component, for additional handling
     * @throws {Error} If we somehow didn't catch that there weren't enough terms (maybe should be `EzError`?)
     * @memberof TFQComponent
     * @constructor
     */
    constructor(term: Term, set: Set, sets: Set[], parent: QuestionComponent) {
        super("True/False", term, set, sets, parent, html, css);
        this.choices = { prompt: term, answer: term };
        if (Math.random() < 0.5) {
            let allOptions = this.term.allOptions(this.sets);
            if (allOptions.length < 1)
                throw new Error(
                    "Oops!  We didn't catch that there weren't enough terms!",
                );

            const i = Math.floor(Math.random() * allOptions.length);
            this.choices.answer = allOptions[i];
        }
        this.parent.prompt = `${this.choices.prompt.prompt} ⇒ ${this.choices.answer.answer}`;
    }

    /**
     * @description Called when a button is pressed, deals with giving `answer()` the right info
     * @memberof TFQComponent
     * @param {MouseEventSRA} e The event created when the button is pressed, includes the id of the decorator
     * @returns {void}
     */
    @ClickSRA("true")
    @ClickSRA("false")
    act(e: MouseEventSRA): void {
        const b = parseBoolean(e.idSRA);
        if (b === undefined) return;
        this.answer(b);
    }

    /**
     * @description Handles everything that needs to happen when the button is pressed
     * @memberof TFQComponent
     * @param {boolean} expect Which button was pressed
     * @returns {void}
     */
    answer(expect: boolean): void {
        const correct =
            this.choices.prompt.matches(this.choices.answer).answer === expect;
        this.term.update(correct, this.type, this.main);
        this.parent.answer(correct, expect ? "True" : "False");
    }
}
