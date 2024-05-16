import html from "./NewQ.component.html";
import css from "./NewQ.component.css";
import { QuestionBody } from "../../EzComponent_subclasses";
import { Term, Set } from "../../database";
import { QuestionComponent } from "../question/question.component";
import { Click } from "@gsilber/webez";

/**
 * @description A class for handling all of the behaviour related to beginning to practice a new term
 * @class NewQComponent
 * @extends {QuestionBody}
 */
export class NewQComponent extends QuestionBody {
    /**
     * @description Creates an instance of NewQComponent
     * @param {Term} term The term to start to study
     * @param {Set} set The set from which the term comes
     * @param {Set[]} sets The sets the being studied, so we can go to another term
     * @param {QuestionComponent} parent The parent component, for additional handling
     * @memberof NewQComponent
     * @constructor
     */
    constructor(term: Term, set: Set, sets: Set[], parent: QuestionComponent) {
        super("New Term", term, set, sets, parent, html, css);
        this.parent.prompt = `${this.term.prompt} ⇒ ${this.term.answer}`;
    }

    /**
     * @description Called when the user says they're confident in the term, deals with giving `answer()` the right info
     * @memberof NewQComponent
     * @returns {void}
     */
    @Click("confident")
    confident(): void {
        this.answer(true);
    }

    /**
     * @description Called when the user says they need to practice the term, deals with giving `answer()` the right info
     * @memberof NewQComponent
     * @returns {void}
     */
    @Click("practice")
    practice(): void {
        this.answer(false);
    }

    /**
     * @description Handles everything that needs to happen when a button is pressed
     * @memberof MCQComponent
     * @param {boolean} expect If the user is confident: true
     * @returns {void}
     */
    answer(expect: boolean): void {
        this.term.update(expect, this.type, this.main);
        this.parent.continue();
    }
}
