import { EzComponent } from "@gsilber/webez";
import { MainComponent } from "./app/main.component";
import { QuestionComponent } from "./app/question/question.component";
import { Term, Set } from "./database";
import { QuestionType, QuestionTypes, getQuestionType } from "./question_types";

/**
 * @description An abstract class for adding the `main` getter
 * @abstract
 * @class EzComponentSRA
 * @extends {EzComponent}
 * @prop {MainComponent} main A getter for the main component of the site
 */
export abstract class EzComponentSRA extends EzComponent {
    /**
     * @description Creates an instance of EzComponentSRA
     * @param {EzComponentSRA | MainComponent} parent The component that created this one (at least, that's what its supposed to be)
     * @param {string} html The HTML code for this component
     * @param {string} css The CSS styling for this component
     * @memberof EzComponentSRA
     * @constructor
     */
    constructor(
        protected parent: EzComponentSRA | MainComponent,
        html: string,
        css: string,
    ) {
        super(html, css);
    }

    /**
     * @description The main component of the site, walks up the parents recursively until it gets to it
     * @type {MainComponent}
     * @memberof EzComponentSRA
     */
    public get main(): MainComponent {
        return this.parent.main;
    }
}

/**
 * @description An abstract class to be extended by everything that's not a page
 * @abstract
 * @class SubComponent
 * @extends {EzComponentSRA}
 */
export abstract class SubComponent extends EzComponentSRA {
    /**
     * @description Creates an instance of SubComponent
     * @param {EzComponentSRA | MainComponent} parent The component that created this one (at least, that's what its supposed to be)
     * @param {string} html The HTML code for this component
     * @param {string} css The CSS styling for this component
     * @memberof SubComponent
     * @constructor
     */
    constructor(
        parent: EzComponentSRA | MainComponent,
        html: string,
        css: string,
    ) {
        super(parent, html, css);
    }
}

/**
 * @description An abstract class to be extended by everything that *is* a page
 * @abstract
 * @class PageComponent
 * @extends {EzComponentSRA}
 */
export abstract class PageComponent extends EzComponentSRA {
    /**
     * @description Creates an instance of PageComponent
     * @param {MainComponent} parent The component that created this one (at least, that's what its supposed to be)
     * @param {string} html The HTML code for this component
     * @param {string} css The CSS styling for this component
     * @memberof PageComponent
     * @constructor
     */
    constructor(parent: MainComponent, html: string, css: string) {
        super(parent, html, css);
    }

    /**
     * @description Some pages have something that should be called on exit; most don't, though
     * @returns {void}
     * @memberof PageComponent
     */
    onExit(): void {
        return;
    }
}

/**
 * @description An abstract class to be extended by everything that is the body of a question
 * @abstract
 * @class QuestionBody
 * @extends {SubComponent}
 */
export abstract class QuestionBody extends SubComponent {
    /**
     * @description The type of question
     * @type {QuestionType}
     * @protected
     * @memberof QuestionBody
     */
    protected type: QuestionType;

    /**
     * @description Creates an instance of QuestionBody
     * @param {QuestionTypes} type The type of question, but as a string (gets the actual thing in the body)
     * @param {Term} term The term the user's practicing here
     * @param {Set} set The set that term comes from
     * @param {Set[]} sets All of the sets they're practicing
     * @param {QuestionComponent} parent The component that created this one (at least, that's what its supposed to be)
     * @param {string} html The HTML code for this component
     * @param {string} css The CSS styling for this component
     * @memberof QuestionBody
     * @constructor
     */
    constructor(
        type: QuestionTypes,
        protected term: Term,
        protected set: Set,
        protected sets: Set[],
        protected parent: QuestionComponent,
        html: string,
        css: string,
    ) {
        super(parent, html, css);
        this.type = getQuestionType(type);
    }

    /**
     * @description A function each question type needs for some of its own handling; updates the database, etc
     * @param expect Different types depending on what question type, generally what the correct answer is or something to that effect
     * @returns {void}
     * @abstract
     * @memberof QuestionBody
     */
    abstract answer(expect: any): void;
}
