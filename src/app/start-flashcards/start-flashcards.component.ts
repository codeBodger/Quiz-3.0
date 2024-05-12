import html from "./start-flashcards.component.html";
import css from "./start-flashcards.component.css";
import { PageComponet } from "../../EzComponent_subclasses";
import { MainComponent } from "../main.component";
import { Set, Term, TermSet } from "../../database";
import { Click } from "@gsilber/webez";

export class StartFlashcardsComponent extends PageComponet {
    constructor(
        private sets: Set[],
        main: MainComponent,
    ) {
        super(main, html, css);
    }

    @Click("all")
    all(): void {
        this.procede(true, () => true);
    }

    @Click("started")
    started(): void {
        this.procede(false, () => true);
    }

    @Click("practice")
    practice(): void {
        this.procede(false, (term: Term) => !term.confident);
    }

    procede(all: boolean, predicate: (term: Term) => boolean): void {
        let sets = this.sets;
        if (!all) {
            const categorised = Set.categorise(this.sets, "confident");
            sets = categorised.done;
            if (categorised.doing) sets.push(categorised.doing);
        }
        let termSets: TermSet[] = [];
        sets.forEach((set: Set) => {
            set.terms.forEach((term: Term) => {
                if (predicate(term)) termSets.push({ term, set: set.name });
            });
        });

        // Shuffle algorithm adapted from https://bost.ocks.org/mike/shuffle/compare.html
        let i: number = termSets.length;
        while (i) {
            let ind = Math.floor(Math.random() * i--);
            let t = termSets[i];
            termSets[i] = termSets[ind];
            termSets[ind] = t;
        }

        this.main.doFlashcards(termSets);
    }

    onExit(): void {
        return;
    }
}
