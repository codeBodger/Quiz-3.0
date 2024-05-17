import html from "./TextQ.component.html";
import css from "./TextQ.component.css";
import { QuestionBody } from "../../EzComponent_subclasses";
import { Set, Term } from "../../database";
import { QuestionComponent } from "../question/question.component";
import { Click, GenericEvent, Input, ValueEvent } from "@gsilber/webez";

/**
 * @description A class for handling all of the behaviour related to the TextQ question type
 * @class TextQComponent
 * @extends QuestionBody
 */
export class TextQComponent extends QuestionBody {
    /**
     * @description The text that's been input by the user
     * @memberof TextQComponent
     * @type {string}
     * @private
     */
    private input: string = "";

    /**
     * @description Creates an instance of TextQComponent
     * @param {Term} term The term the user is being tested on
     * @param {Set} set The set the term comes from
     * @param {Set[]} sets The sets the user is studying
     * @param {QuestionComponent} parent The parent component, for additional handling
     * @memberof TextQComponent
     * @constructor
     */
    constructor(term: Term, set: Set, sets: Set[], parent: QuestionComponent) {
        super("Text Entry", term, set, sets, parent, html, css);
    }

    /**
     * @description Updates the value of `this.input` each time the user changes what's in the textbox
     * @param {ValueEvent} e The event created when the user changes what's in the textbox
     * @memberof TextQComponent
     * @returns {void}
     */
    @Input("answer")
    update(e: ValueEvent): void {
        this.input = e.value;
    }

    /**
     * @description Handles everything that needs to happen when the user submits their answer (<enter> or "Submit")
     * @param {KeyboardEvent | MouseEvent} e The event created when the user submits their answer
     * @returns {void}
     * @memberof TextQComponent
     */
    @Click("submit")
    @GenericEvent("answer", "keyup")
    answer(e: KeyboardEvent | MouseEvent): void {
        if (e instanceof KeyboardEvent && e.key !== "Enter") return;
        const correct = this.term.answer === this.input;
        this.term.update(correct, this.type, this.main);
        this.parent.answer(correct, this.input);
    }
}
