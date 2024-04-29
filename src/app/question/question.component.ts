import html from "./question.component.html";
import css from "./question.component.css";
import { PageComponet, QuestionBody } from "../../EzComponent_subclasses";
import { MainComponent } from "../main.component";
import { Set, Term } from "../../database";
import { MCQComponent } from "../MCQ/MCQ.component";
import { TextQComponent } from "../TextQ/TextQ.component";
import { TFQComponent } from "../TFQ/TFQ.component";

export class QuestionComponent extends PageComponet {
    private questionBody: QuestionBody;
    constructor(
        private term: Term,
        private set: Set,
        sets: Set[],
        main: MainComponent,
    ) {
        super(main, html, css);
        switch (term.chooseQuestionType()) {
            case "MCQ":
                this.questionBody = new MCQComponent(term, sets, this, main);
                break;
            case "TFQ":
                this.questionBody = new TFQComponent(term, sets, this, main);
                break;
            case "TextQ":
                this.questionBody = new TextQComponent(term, sets, this, main);
                break;
        }
        this.addComponent(this.questionBody, "question");
    }

    onActivate(): void {
        return;
    }
}
