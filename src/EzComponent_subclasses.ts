import { EzComponent } from "@gsilber/webez";
import { MainComponent } from "./app/main.component";
import { QuestionComponent } from "./app/question/question.component";
import { Term, Set } from "./database";
import { QuestionType, QuestionTypes, getQuestionType } from "./question_types";

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

export abstract class QuestionBody extends SubComponent {
    protected type: QuestionType;
    constructor(
        type: QuestionTypes,
        protected term: Term,
        protected set: Set,
        protected sets: Set[],
        protected parent: QuestionComponent,
        main: MainComponent,
        html: string,
        css: string,
    ) {
        super(parent, main, html, css);
        this.type = getQuestionType(type);
    }

    abstract answer(expect: any): void;
}

declare const window: Window;
export class OverlayError extends Error {
    constructor(message?: string) {
        super(message);
        const errElem = window.document.getElementById("error");
        errElem?.setAttribute("value", message ?? "");
        errElem?.click();
    }
}
