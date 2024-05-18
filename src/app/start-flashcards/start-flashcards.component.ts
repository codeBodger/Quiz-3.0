import html from "./start-flashcards.component.html";
import css from "./start-flashcards.component.css";
import { PageComponet } from "../../EzComponent_subclasses";
import { MainComponent } from "../main.component";
import { Set, Term, TermSet } from "../../database";
import { ClickSRA, MouseEventSRA } from "../../decoratorsSRA";

export class StartFlashcardsComponent extends PageComponet {
    constructor(
        private sets: Set[],
        parent: MainComponent,
    ) {
        super(parent, html, css);
    }

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
