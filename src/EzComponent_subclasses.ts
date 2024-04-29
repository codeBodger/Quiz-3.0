import { BindValue, EzComponent } from "@gsilber/webez";
import { MainComponent } from "./app/main.component";
import { QuestionComponent } from "./app/question/question.component";
import { Term, Set } from "./database";

export class SubComponent extends EzComponent {
    constructor(
        protected parent: SubComponent | MainComponent | PageComponet,
        protected main: MainComponent,
        html: string,
        css: string,
    ) {
        super(html, css);
    }
}

export abstract class PageComponet extends EzComponent {
    constructor(
        protected main: MainComponent,
        html: string,
        css: string,
    ) {
        super(html, css);
    }

    abstract onActivate(): void;
}

export type QuestionTypes = "Multiple Choice" | "True/False" | "Text Entry";
export class QuestionBody extends SubComponent {
    @BindValue("name")
    protected name: QuestionTypes | "" = "";

    constructor(
        protected term: Term,
        protected set: Set,
        protected sets: Set[],
        protected parent: QuestionComponent,
        main: MainComponent,
        html: string,
        css: string,
    ) {
        super(parent, main, html, css);
    }
}
