import html from "./flashcards.component.html";
import css from "./flashcards.component.css";
import { PageComponet } from "../../EzComponent_subclasses";
import { MainComponent } from "../main.component";
import { Term, TermSet } from "../../database";
import { BindValue, Click } from "@gsilber/webez";
import { BindVisibleToBooleanSRA } from "../../decoratorsSRA";

export type AdjacentCards = {
    previous: FlashcardsComponent | undefined;
    next: FlashcardsComponent | undefined;
};
type ProAns = "prompt" | "answer";
export class FlashcardsComponent extends PageComponet {
    @BindValue("prompt", (v: Term) => v.prompt)
    @BindValue("answer", (v: Term) => v.answer)
    @BindVisibleToBooleanSRA("star", (v: Term) => v.confident)
    private term: Term = new Term();

    @BindVisibleToBooleanSRA("prompt", (v: ProAns) => {
        console.log(v, v === "prompt");
        return v === "prompt";
    })
    @BindVisibleToBooleanSRA("answer", (v: ProAns) => {
        console.log(v, v === "answer");
        return v === "answer";
    })
    private side: ProAns = "prompt";

    @BindValue("set")
    private set = "";

    @BindValue("index", (v: number) => `${v + 1}`)
    private index = 0;

    @BindValue("total", (v: TermSet[]) => `${v.length}`)
    private termSets: TermSet[] = [];

    constructor(termSets: TermSet[], main: MainComponent) {
        super(main, html, css);
        this.termSets = termSets;
        this.update();
    }

    update(): void {
        this.index %= this.termSets.length;
        this.index += this.termSets.length;
        this.index %= this.termSets.length;
        this.term = this.termSets[this.index].term;
        this.set = this.termSets[this.index].set;
    }

    @Click("previous")
    previous(): void {
        this.index--;
        this.update();
    }

    @Click("next")
    next(): void {
        this.index++;
        this.update();
    }

    @Click("practice")
    practice(): void {
        this.term.confident = false;
        this.next();
    }

    @Click("confident")
    confident(): void {
        this.term.confident = true;
        this.next();
    }

    @Click("prompt")
    @Click("answer")
    toggle(): void {
        this.side = this.side === "prompt" ? "answer" : "prompt";
        this.update();
    }

    onExit(): void {
        return;
    }
}
