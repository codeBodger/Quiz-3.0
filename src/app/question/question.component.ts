import html from "./question.component.html";
import css from "./question.component.css";
import { PageComponet, QuestionBody } from "../../EzComponent_subclasses";
import { MainComponent } from "../main.component";
import { Set, Term } from "../../database";
import { MCQComponent } from "../MCQ/MCQ.component";
import { AnswerComponent } from "../answer/answer.component";
import { BindValue } from "@gsilber/webez";
import { TextQComponent } from "../TextQ/TextQ.component";
import { TFQComponent } from "../TFQ/TFQ.component";
import { NewQComponent } from "../NewQ/NewQ.component";
import { QuestionType } from "../../question_types";
import { MatchQComponent } from "../MatchQ/MatchQ.component";
import { CharQComponent } from "../CharQ/CharQ.component";

export class QuestionComponent extends PageComponet {
    @BindValue("name", (v?: QuestionType) => v?.name ?? "")
    public type: QuestionType;
    @BindValue("prompt")
    public prompt: string = "";
    @BindValue("set", (set?: Set) => set?.name ?? "")
    private set: Set;

    private questionBody: QuestionBody;
    private answerBody: AnswerComponent;

    constructor(
        term: Term,
        set: Set,
        private sets: Set[],
        main: MainComponent,
    ) {
        super(main, html, css);
        this.prompt = term.prompt;
        this.set = set;
        const args: [Term, Set, Set[], QuestionComponent, MainComponent] = [
            term,
            set,
            sets,
            this,
            main,
        ];
        this.type = term.chooseQuestionType();
        switch (this.type.name) {
            case "New Term":
                this.questionBody = new NewQComponent(...args);
                break;
            case "Multiple Choice":
                this.questionBody = new MCQComponent(...args);
                break;
            case "True/False":
                this.questionBody = new TFQComponent(...args);
                break;
            case "Matching":
                this.questionBody = new MatchQComponent(...args);
                break;
            case "Character Entry":
                this.questionBody = new CharQComponent(...args);
                break;
            case "Text Entry":
                this.questionBody = new TextQComponent(...args);
                break;
        }
        this.addComponent(this.questionBody, "question-answer");
        this.answerBody = new AnswerComponent(term, this, this.main);
    }

    answer(correct: boolean, answer: string): void {
        this.removeComponent(this.questionBody);
        this.answerBody.init(correct, answer);
        this.addComponent(this.answerBody, "question-answer");
    }

    continue(): void {
        if (this.set.justMastered()) this.main.masteredSet(this.set, this.sets);
        else this.main.askFrom(this.sets);
    }

    onActivate(): void {
        return;
    }

    onExit(): void {
        return;
    }
}
