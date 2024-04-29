import html from "./MCQ.component.html";
import css from "./MCQ.component.css";
import { QuestionBody } from "../../EzComponent_subclasses";
import { Set, Term } from "../../database";
import { QuestionComponent } from "../question/question.component";
import { MainComponent } from "../main.component";
import { BindValue, Click } from "@gsilber/webez";

export class MCQComponent extends QuestionBody {
    protected name: "Multiple Choice" = "Multiple Choice";

    @BindValue("prompt")
    private prompt: string;
    @BindValue("set")
    private setName: string;

    @BindValue("ans1")
    private name1: string = "";
    @BindValue("ans2")
    private name2: string = "";
    @BindValue("ans3")
    private name3: string = "";
    @BindValue("ans4")
    private name4: string = "";

    constructor(
        term: Term,
        set: Set,
        sets: Set[],
        parent: QuestionComponent,
        main: MainComponent,
    ) {
        super(term, set, sets, parent, main, html, css);
        this.prompt = term.prompt;
        this.setName = `In set: ${set.name}`;
        const options = this.getOptions();
        let nums = [1, 2, 3, 4];
        for (let i = 0; i < 4; i++) {
            let ind = Math.floor(Math.random() * nums.length);
            switch (nums[ind]) {
                case 1:
                    this.name1 = options[i].answer;
                    this.act1 = () => {
                        this.answer(options[i]);
                    };
                    break;
                case 2:
                    this.name2 = options[i].answer;
                    this.act2 = () => {
                        this.answer(options[i]);
                    };
                    break;
                case 3:
                    this.name3 = options[i].answer;
                    this.act3 = () => {
                        this.answer(options[i]);
                    };
                    break;
                case 4:
                    this.name4 = options[i].answer;
                    this.act4 = () => {
                        this.answer(options[i]);
                    };
                    break;
            }
            nums[ind] = nums[nums.length - 1];
            nums.pop();
        }
    }

    getOptions(): [Term, Term, Term, Term] {
        let allOptions: Term[] = [];
        this.sets.forEach((set: Set) => {
            set.terms.forEach((term: Term) => {
                if (term.matches(this.term) === "none") allOptions.push(term);
            });
        });
        let out: [Term, Term, Term, Term] = [
            this.term,
            this.term,
            this.term,
            this.term,
        ];
        for (let i = 1; i < 4; i++) {
            let ind = Math.floor(Math.random() * allOptions.length);
            out[i] = allOptions[ind];
            allOptions[ind] = allOptions[allOptions.length - 1];
            allOptions.pop();
        }
        return out;
    }

    @Click("ans1")
    act1(): void {
        console.log("1");
    }
    @Click("ans2")
    act2(): void {
        console.log("2");
    }
    @Click("ans3")
    act3(): void {
        console.log("3");
    }
    @Click("ans4")
    act4(): void {
        console.log("4");
    }

    answer(answer: Term) {
        console.log("hi");
        this.term.update(
            this.term.matches(answer) === "exactly",
            this.name,
            //this.main,
        );
    }
}
