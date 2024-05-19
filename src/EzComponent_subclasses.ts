import { EzComponent } from "@gsilber/webez";
import { MainComponent } from "./app/main.component";
import { QuestionComponent } from "./app/question/question.component";
import { Term, Set } from "./database";
import { QuestionType, QuestionTypes, getQuestionType } from "./question_types";

export abstract class EzComponentSRA extends EzComponent {
    constructor(
        protected parent: EzComponentSRA | MainComponent,
        html: string,
        css: string,
    ) {
        super(html, css);
    }
    public get main(): MainComponent {
        return this.parent.main;
    }
}

export abstract class SubComponent extends EzComponentSRA {
    constructor(
        parent: EzComponentSRA | MainComponent,
        html: string,
        css: string,
    ) {
        super(parent, html, css);
    }
}

export abstract class PageComponent extends EzComponentSRA {
    constructor(parent: MainComponent, html: string, css: string) {
        super(parent, html, css);
    }

    onExit(): void {
        return;
    }
}

export abstract class QuestionBody extends SubComponent {
    protected type: QuestionType;
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

    abstract answer(expect: any): void;
}
