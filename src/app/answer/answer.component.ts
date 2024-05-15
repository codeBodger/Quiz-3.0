import html from "./answer.component.html";
import css from "./answer.component.css";
import { SubComponent } from "../../EzComponent_subclasses";
import { QuestionComponent } from "../question/question.component";
import { MainComponent } from "../main.component";
import { Term } from "../../database";
import { BindStyle, BindValue, Click } from "@gsilber/webez";

/**
 * @description A component to display whether the user got a question right or not
 * @export
 * @class AnswerComponent
 * @extends {SubComponent}
 * @example const ans = new AnswerComponent(term, this, this.main);
 */
export class AnswerComponent extends SubComponent {
    /**
     * @description Whether the user's answer was correct; used for the message
     * @memberof AnswerComponent
     * @type {boolean}
     * @private
     */
    @BindStyle("correct", "color", (val: boolean) => (val ? "#218c64" : "red"))
    @BindValue("correct", (val: boolean) => (val ? "Correct!" : "Incorrect"))
    @BindStyle("corrected-message", "visibility", (val: boolean) =>
        val ? "hidden" : "visible",
    )
    private correct: boolean = true;

    /**
     * @description The answer given, again used for part of the message
     * @memberof AnswerComponent
     * @type {string}
     * @private
     */
    @BindValue("answer")
    private answer: string = "";

    /**
     * @description The correct answer, used in the message, buy only shown if wrong
     * @memberof AnswerComponent
     * @type {string}
     * @private
     */
    @BindValue("corrected")
    private corrected: string = "";

    /**
     * @description Creates an instance of AnswerComponent
     * @param {Term} [term] The term that is being answered
     * @param {QuestionComponent} [parent] The component that created this
     * @param {MainComponent} [main] The root/main component of the whole webapp
     * @memberof AnswerComponent
     * @public
     * @constructor
     * @example const ans = new AnswerComponent(term, this, this.main);
     */
    constructor(
        private term: Term,
        protected parent: QuestionComponent,
        main: MainComponent,
    ) {
        super(parent, main, html, css);
    }

    /**
     * @description Updates this with the latest information, so we don't have to create a new one each time
     * @param {boolean} [correct] Whether the user chose the correct option
     * @param {string} [answer] The answer given by the user
     * @returns {void}
     * @memberof AnswerComponent
     * @example ans.init(true, "easy_answer");
     */
    init(correct: boolean, answer: string): void {
        this.correct = correct;
        this.answer = answer;
        this.corrected = this.term.answer;
    }

    /**
     * @description Goes to the next Question when "Continue" is pressed
     * @returns {void}
     * @memberof AnswerComponent
     */
    @Click("continue")
    continue(): void {
        this.parent.continue();
    }
}
