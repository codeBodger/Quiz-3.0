import html from "./start-flashcards.component.html";
import css from "./start-flashcards.component.css";
import { PageComponent } from "../../EzComponent_subclasses";
import { MainComponent } from "../main.component";
import { Set, Term, TermSet } from "../../database";
import { ClickSRA, MouseEventSRA } from "../../decoratorsSRA";

/**
 * @description A class to handle the user choosing how they want to practice with flashcards
 * @class StartFlashcardsComponent
 * @extends PageComponent
 */
export class StartFlashcardsComponent extends PageComponent {
    /**
     * @description Creates an instance of StartFlashcardsComponent
     * @param {Set[]} sets The sets to be practiced
     * @param {MainComponent} parent The main component of the app, for additonal handling
     * @memberof StartFlashcardsComponent
     * @constructor
     */
    constructor(
        private sets: Set[],
        parent: MainComponent,
    ) {
        super(parent, html, css);
    }

    /**
     * @description Called when the user clicks on one of the options; handles which terms to give and gives them to FlashcardsComponent
     * @param {MouseEventSRA} e The event created when the button is pressed, includes the id of the decorator
     * @returns {void}
     * @memberof StartFlashcardsComponent
     */
    @ClickSRA("all")
    @ClickSRA("started")
    @ClickSRA("practice")
    procede(e: MouseEventSRA): void {
        let sets = this.sets;
        if (e.idSRA !== "all") {
            const categorised = Set.categorise(this.sets, "confident");
            sets = categorised.done;
            if (categorised.doing) sets.push(categorised.doing);
        }
        const practice = e.idSRA === "practice";
        let termSets: TermSet[] = [];
        sets.forEach((set: Set) => {
            set.terms.forEach((term: Term) => {
                if (!(practice && term.confident))
                    termSets.push({ term, set: set.name });
            });
        });

        /**Shuffle algorithm adapted from https://bost.ocks.org/mike/shuffle/compare.html */
        let i: number = termSets.length;
        while (i) {
            let ind = Math.floor(Math.random() * i--);
            let t = termSets[i];
            termSets[i] = termSets[ind];
            termSets[ind] = t;
        }

        this.main.doFlashcards(termSets);
    }
}
