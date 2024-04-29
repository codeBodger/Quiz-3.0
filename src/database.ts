import { EzDialog } from "@gsilber/webez";
import { MainComponent } from "./app/main.component";
import { QuestionTypes } from "./EzComponent_subclasses";

declare const window: Window;

export class Term {
    public index: number = -1;
    private mastery: number;
    constructor(
        readonly answer: string,
        readonly prompt: string,
        mastery: number | undefined,
    ) {
        mastery = isNaN(mastery ?? NaN) ? undefined : mastery;
        this.mastery = mastery ?? 5_000_000;
    }

    static fromTSV(data: string, main: MainComponent): Term | undefined {
        const dataArr = data.split("\t");
        if (dataArr.length < 2) {
            EzDialog.popup(main, `Bad term data: ${data}`);
            return undefined;
        }
        // main.saveDatabase();
        return new Term(dataArr[0], dataArr[1], parseFloat(dataArr[2]));
    }

    matches(term: Term): "exactly" | "prompt" | "none" {
        if (this.prompt === term.prompt) {
            if (this.answer === term.answer) return "exactly";
            return "prompt";
        }
        return "none";
    }

    chooseQuestionType(): QuestionTypes {
        switch (Math.floor(Math.random() * 3)) {
            case 0:
                return "Multiple Choice";
            case 1:
                return "True/False";
            case 2:
            default:
                return "Text Entry";
        }
    }

    update(success: boolean, type: QuestionTypes /*, main: MainComponent*/) {
        let changeFactor = [1, 1];
        switch (type) {
            case "Multiple Choice":
                changeFactor = [0.8, 1.2];
                break;
            case "True/False":
                changeFactor = [0.9, 1.1];
                break;
            case "Text Entry":
                changeFactor = [0.6, 1.2];
                break;
        }
        this.mastery *= changeFactor[success ? 1 : 0];
        // main.saveDatabase();
    }

    toString(): string {
        return `${this.answer}\t${this.prompt}\t${this.mastery}`;
    }
}

export type SetActivities = "Practice";
export class Set {
    constructor(
        readonly name: string,
        public terms: Term[] = [],
    ) {}

    static fromTSV(data: string, main: MainComponent): Set {
        const dataArr = data.split("\n");
        const name = dataArr[0];
        let termArr: Term[] = [];
        for (let termData of dataArr.slice(1)) {
            if (!termData) continue;
            const term = Term.fromTSV(termData, main);
            if (term === undefined) continue;
            termArr.push(term);
        }
        // main.saveDatabase();
        return new Set(name, termArr);
    }

    merge(set: Set, main: MainComponent): void {
        for (let term of set.terms) {
            let existantTerm = this.getTerm(term.prompt);
            switch (existantTerm?.matches(term)) {
                case "exactly":
                    continue;
                case "prompt":
                    var temp = existantTerm.index;
                    EzDialog.popup(
                        main,
                        `The term with the prompt "${term.prompt}" already exists in this set.
Please choose one answer to keep.
Original: "${existantTerm.answer}"
New: "${term.answer}"`,
                        "Huh?",
                        ["Original", "New"],
                    ).subscribe((value: string) => {
                        if (value === "New") {
                            this.terms[temp] = term;
                        }
                    });
                    continue;
                case "none":
                    this.terms.push(term);
            }
        }
        // main.saveDatabase();
    }

    getTerm(prompt: string): Term | undefined {
        return this.terms.reduce((acc: Term | undefined, term, i) => {
            term.index = i;
            return term.prompt === prompt ? term : acc;
        }, undefined);
    }

    chooseTerm(): Term {
        return this.terms[Math.floor(Math.random() * this.terms.length)];
    }

    toString(): string {
        return (
            this.name +
            "\n" +
            this.terms.map((term: Term) => term.toString()).join("\n")
        );
    }
}

export class Database {
    private sets: Set[] = [];

    constructor(data: string, main: MainComponent) {
        for (let setStr of data.split("\n\n"))
            this.addOrUpdateSet(setStr, main);
    }

    addOrUpdateSet(setData: string, main: MainComponent): void {
        const newSet = Set.fromTSV(setData, main);
        for (let set of this.sets) {
            if (set.name === newSet.name) {
                set.merge(newSet, main);
                return;
            }
        }
        this.sets.push(newSet);
        // main.saveDatabase();
    }

    static loadDatabase(main: MainComponent): Database {
        return new Database(
            window.localStorage.getItem("database") ?? "",
            main,
        );
    }

    getSets(): Set[] {
        return this.sets;
    }

    save(): void {
        window.localStorage.setItem(
            "database",
            this.sets.map((set: Set) => set.toString()).join("\n\n"),
        );
    }
}
