import { EzComponent } from "@gsilber/webez";
import { MainComponent } from "./app/main.component";
import { Term } from "./database";
import { QuestionComponent } from "./app/question/question.component";

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

export class PageComponet extends EzComponent {
    constructor(
        protected main: MainComponent,
        html: string,
        css: string,
    ) {
        super(html, css);
    }
}

export type QuestionTypes = "MCQ" | "TFQ" | "TextQ";
export class QuestionBody extends SubComponent {
    constructor(
        protected term: Term,
        protected parent: QuestionComponent,
        main: MainComponent,
        html: string,
        css: string,
    ) {
        super(parent, main, html, css);
    }
}
