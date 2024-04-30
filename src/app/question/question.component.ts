import html from "./question.component.html";
import css from "./question.component.css";
import {
    PageComponet,
    QuestionBody,
    QuestionTypes,
} from "../../EzComponent_subclasses";
import { MainComponent } from "../main.component";
import { Set, Term } from "../../database";
import { MCQComponent } from "../MCQ/MCQ.component";
import { AnswerComponent } from "../answer/answer.component";
import { BindValue } from "@gsilber/webez";
// import { TextQComponent } from "../TextQ/TextQ.component";
// import { TFQComponent } from "../TFQ/TFQ.component";

export class QuestionComponent extends PageComponet {
    @BindValue("name")
    public name: QuestionTypes | "" = "";
    @BindValue("prompt")
    public prompt: string = "";
    @BindValue("set")
    public setName: string = "";

    private questionBody: QuestionBody;
    private answerBody: AnswerComponent;
    constructor(term: Term, set: Set, sets: Set[], main: MainComponent) {
        super(main, html, css);
        this.prompt = term.prompt;
        this.setName = set.name;
        const args: [Term, Set, Set[], QuestionComponent, MainComponent] = [
            term,
            set,
            sets,
            this,
            main,
        ];
        // switch (term.chooseQuestionType()) {
        //     case "MCQ":
        this.questionBody = new MCQComponent(...args);
        //         break;
        //     case "TFQ":
        //         this.questionBody = new TFQComponent(...args);
        //         break;
        //     case "TextQ":
        //         this.questionBody = new TextQComponent(...args);
        //         break;
        // }
        this.addComponent(this.questionBody, "question-answer");
        this.answerBody = new AnswerComponent(term, this, this.main);
    }

    onActivate(): void {
        return;
    }

    answer(correct: boolean, answer: string): void {
        this.removeComponent(this.questionBody);
        this.answerBody.init(correct, answer);
        this.addComponent(this.answerBody, "question-answer");
    }
}
