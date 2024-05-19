import html from "./flashcards.component.html";
import css from "./flashcards.component.css";
import { PageComponent } from "../../EzComponent_subclasses";
import { MainComponent } from "../main.component";
import { Term, TermSet } from "../../database";
import { BindValue, Click } from "@gsilber/webez";
import {
    BindCSSClassToBooleanSRA,
    BindVisibleToBooleanSRA,
    ClickSRA,
    MouseEventSRA,
} from "../../decoratorsSRA";

/**
 * @description A type for easier readability
 */
type ProAns = "prompt" | "answer";

/**
 * @description The component for dealing with flashcards
 * @class FlashcardsComponent
 * @extends PageComponent
 */
export class FlashcardsComponent extends PageComponent {
    /**
     * @description The term currently being practiced
     * @memberof FlashcardsComponent
     * @type {Term}
     * @private
     * @summary Is bound in various ways to some elements so they're visible as they should be
     */
    @BindValue("prompt", (v: Term) => v.prompt)
    @BindValue("answer", (v: Term) => v.answer)
    @BindVisibleToBooleanSRA("star", (v: Term) => v.confident)
    private term: Term = new Term();

    /**
     * @description Keeping track of which side the flashcard is on
     * @memberof FlashcardsComponent
     * @type {ProAns}
     * @private
     * @summary Bound to the visibility of the buttons for each side of the card
     */
    @BindVisibleToBooleanSRA("prompt", (v: ProAns) => v === "prompt")
    @BindVisibleToBooleanSRA("answer", (v: ProAns) => v === "answer")
    private side: ProAns = "prompt";

    /**
     * @description The name of the set of the current card
     * @memberof FlashcardsComponent
     * @type {string}
     * @private
     * @summary Bound to a message saying what set we're in
     */
    @BindValue("set")
    private set: string = "";

    /**
     * @description Keeping track of where in the list of TermSets we are
     * @memberof FlashcardsComponent
     * @type {number}
     * @private
     * @summary Bound (+1) to a message telling the user their progress in the set
     * Bound to style of "previous", so it's disabled if the user is at the first flashcard
     */
    @BindValue("index", (v: number) => `${v + 1}`)
    @BindCSSClassToBooleanSRA("previous", "disabled", (v: number) => v === 0)
    private index: number = 0;

    /**
     * @description The list of TermSets (terms with the set they're in) that are being practiced
     * @memberof FlashcardsComponent
     * @type {TermSet[]}
     * @private
     * @summary The length here is bound to the other part of the progress message
     */
    @BindValue("total", (v: TermSet[]) => `${v.length}`)
    private termSets: TermSet[] = [];

    /**
     * @description Creates an instance of FlashcardsComponent
     * @param {TermSet[]} termSets See this.termSets
     * @param {MainComponent} parent The main component that of the program
     * @memberof FlashcardsComponent
     * @constructor
     */
    constructor(termSets: TermSet[], parent: MainComponent) {
        super(parent, html, css);
        this.termSets = termSets;
        this.update();
    }

    /**
     * @description Ensures that index is within bounds and sets this.term and this.set
     * @returns {void}
     * @memberof FlashcardsComponent
     */
    update(): void {
        this.index %= this.termSets.length;
        this.index += this.termSets.length;
        this.index %= this.termSets.length;
        this.term = this.termSets[this.index].term;
        this.set = this.termSets[this.index].set;
    }

    /**
     * @description Returns to the previous indexed term in the list (prevents index from being < 0)
     * @returns {void}
     * @memberof FlashcardsComponent
     */
    @Click("previous")
    previous(): void {
        this.index--;
        if (this.index < 0) {
            this.index = 0;
            return;
        }
        this.side = "prompt";
        this.update();
    }

    /**
     * @description Advances to the next term in the list
     * @returns {void}
     * @memberof FlashcardsComponent
     */
    @Click("next")
    next(): void {
        this.index++;
        this.side = "prompt";
        this.update();
    }

    /**
     * @description Sets whether the user is confident in the term and then advances
     * @param {MouseEventSRA} e The event created when the button is pressed, includes the id of the decorator
     * @returns {void}
     * @memberof FlashcardsComponent
     */
    @ClickSRA("practice")
    @ClickSRA("confident")
    confident(e: MouseEventSRA): void {
        let confident = false;
        if (e.idSRA === "confident") confident = true;
        else if (e.idSRA !== "practice") return;

        this.term.update(confident, "Flashcard", this.main);
        this.next();
    }

    /**
     * @description Flips the card
     * @returns {void}
     * @memberof FlashcardsComponent
     */
    @Click("prompt")
    @Click("answer")
    toggle(): void {
        this.side = this.side === "prompt" ? "answer" : "prompt";
        this.update();
    }
}
