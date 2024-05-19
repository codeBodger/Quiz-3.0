import html from "./question.component.html";
import css from "./question.component.css";
import { PageComponent, QuestionBody } from "../../EzComponent_subclasses";
import { MainComponent } from "../main.component";
import { Set, Term } from "../../database";
import { MCQComponent } from "../MCQ/MCQ.component";
import { AnswerComponent } from "../answer/answer.component";
import { BindValue } from "@gsilber/webez";
import { TextQComponent } from "../TextQ/TextQ.component";
import { TFQComponent } from "../TFQ/TFQ.component";
import { NewQComponent } from "../NewQ/NewQ.component";
import { QuestionType } from "../../question_types";
import { MatchQComponent } from "../MatchQ/MatchQ.component";
import { CharQComponent } from "../CharQ/CharQ.component";

/**
 * @description The wrapper for the individual questions
 * @class QuestionComponent
 * @extends {PageComponent}
 * @property {string} prompt The prompt, by default the prompt of the term, but could be different depending on the QuestionType
 */
export class QuestionComponent extends PageComponent {
    /**
     * @description The type of question, the name of which is bound to a header
     * @memberof QuestionComponent
     * @type {QuestionType}
     * @private
     */
    @BindValue("name", (v?: QuestionType) => v?.name ?? "")
    private type: QuestionType;

    /**
     * @description The prompt, by default the prompt of the term, but could be different depending on the QuestionType, bound to a header
     * @memberof QuestionComponent
     * @type {string}
     */
    @BindValue("prompt")
    public prompt: string = "";

    /**
     * @description The set from which this term comes, the name of which is bound to part of a header
     * @memberof QuestionComponent
     * @type {Set}
     * @private
     */
    @BindValue("set", (set?: Set) => set?.name ?? "")
    private set: Set;

    /**
     * @description The component for the body of the question
     * @memberof QuestionComponent
     * @type {QuestionBody}
     * @private
     */
    private questionBody: QuestionBody;
    /**
     * @description The component for the answer after the question; some `QuestionType`s don't make use of this
     * @memberof QuestionComponent
     * @type {QuestionBody}
     * @private
     */
    private answerBody: AnswerComponent;

    /**
     * @description Creates an instance of QuestionComponent
     * @param {Term} term The term being practiced
     * @param {Set} set The set from which the term comes
     * @private @param {Set[]} sets All of the sets being practiced, so we can get another term
     * @param {MainComponent} parent The main component of the site, for additional handling
     * @memberof QuestionComponent
     * @constructor
     */
    constructor(
        term: Term,
        set: Set,
        private sets: Set[],
        parent: MainComponent,
    ) {
        super(parent, html, css);
        this.prompt = term.prompt;
        this.set = set;
        this.type = term.chooseQuestionType();
        let bodyConstructor;
        switch (this.type.name) {
            case "New Term":
                bodyConstructor = NewQComponent;
                break;
            case "Multiple Choice":
                bodyConstructor = MCQComponent;
                break;
            case "True/False":
                bodyConstructor = TFQComponent;
                break;
            case "Matching":
                bodyConstructor = MatchQComponent;
                break;
            case "Character Entry":
                bodyConstructor = CharQComponent;
                break;
            case "Text Entry":
                bodyConstructor = TextQComponent;
                break;
        }
        this.questionBody = new bodyConstructor(term, set, sets, this);
        this.addComponent(this.questionBody, "question-answer");
        this.answerBody = new AnswerComponent(term, this);
    }

    /**
     * @description Called if/when `this.questionBody` deems that it should go to the `answer`
     * @param {boolean} correct Whether or not the user was correct
     * @param {string} answer The answer that the user gave, to be used in the message
     * @returns {void}
     * @memberof QuestionComponent
     */
    answer(correct: boolean, answer: string): void {
        this.removeComponent(this.questionBody);
        this.answerBody.init(correct, answer);
        this.addComponent(this.answerBody, "question-answer");
    }

    /**
     * @description Move on to the next question, or, if the set was just mastered, tell the user this
     * @returns {void}
     * @memberof QuestionComponent
     */
    continue(): void {
        if (this.set.justMastered()) this.main.masteredSet(this.set, this.sets);
        else this.main.askFrom(this.sets);
    }
}
