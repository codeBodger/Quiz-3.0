import { EzDialog } from "@gsilber/webez";
import { MainComponent } from "./app/main.component";
import {
    BEGUN,
    MASTERED,
    QuestionType,
    getQuestionType,
} from "./question_types";

declare const window: Window;

export class Term {
    public index: number = -1;
    private mastery: number;
    constructor(
        readonly answer: string = "",
        readonly prompt: string = "",
        mastery?: number,
    ) {
        // mastery = isNaN(mastery ?? NaN) ? undefined : mastery;
        this.mastery = mastery ?? NaN;
    }

    static fromTSV(data: string): Term | undefined {
        const dataArr = data.split("\t");
        if (dataArr.length < 2) {
            return undefined;
        }
        return new Term(dataArr[0], dataArr[1], parseFloat(dataArr[2]));
    }

    matches(term: Term): "exactly" | "prompt" | "none" {
        if (this.prompt === term.prompt) {
            if (this.answer === term.answer) return "exactly";
            return "prompt";
        }
        return "none";
    }

    chooseQuestionType(): QuestionType {
        if (isNaN(this.mastery)) return getQuestionType("New Term");
        switch (Math.floor(Math.random() * 3)) {
            case 0:
                return getQuestionType("Multiple Choice");
            case 1:
                return getQuestionType("True/False");
            case 2:
            default:
                return getQuestionType("Text Entry");
        }
    }

    update(success: boolean, type: QuestionType, main: MainComponent) {
        // console.log(success);
        // console.log(success ? 0 : 1);
        // let changeFactor = [1, 1];
        // switch (type.name) {
        //     case "New Term":
        //         changeFactor = [0, 0];
        //         break;
        //     case "Multiple Choice":
        //         changeFactor = [0.8, 1.2];
        //         break;
        //     case "True/False":
        //         changeFactor = [0.9, 1.1];
        //         break;
        //     case "Text Entry":
        //         changeFactor = [0.6, 1.2];
        //         break;
        // }
        // this.mastery *= changeFactor[success ? 1 : 0];
        this.mastery = type.masteryUpdater(this.mastery, success);
        main.saveDatabase();
    }

    getMastery(): number {
        if (isNaN(this.mastery)) return BEGUN;
        if (this.mastery < MASTERED) this.mastery = MASTERED;
        return this.mastery;
    }

    toString(): string {
        return `${this.answer}\t${this.prompt}\t${this.mastery}`;
    }
}

type SetError = {
    setName: string;
    issue: "have/has bad data" | "already exist(s)";
    errs: string[];
};
export type SetActivities = "Practice";
export class Set {
    constructor(
        readonly name: string,
        public terms: Term[] = [],
    ) {}

    static fromTSV(data: string, caller: Database): Set | undefined {
        data = data.replace(/^\s*/g, "");
        const dataArr = data.split("\n");
        const name = dataArr[0];
        if (!name) return undefined;

        let set = new Set(name);

        // let termArr: Term[] = [];
        let dataError: string[] = [];
        let extantError: string[] = [];
        for (let termData of dataArr.slice(1)) {
            if (!termData) continue;
            const term = Term.fromTSV(termData);
            if (term === undefined) dataError.push(termData);
            else {
                const err = set.addTerm(term);
                if (err !== undefined) extantError.push(err);
            }
        }
        if (dataError.length)
            caller.addSetError({
                setName: name,
                issue: "have/has bad data",
                errs: dataError,
            });
        if (extantError.length)
            caller.addSetError({
                setName: name,
                issue: "already exist(s)",
                errs: extantError,
            });
        return set;
    }

    merge(set: Set, caller: Database): void {
        let extantError: string[] = [];
        for (let term of set.terms) {
            // let existantTerm = this.getTerm(term.prompt);
            // switch (existantTerm?.matches(term)) {
            //     // case "exactly":
            //     //     continue;
            //     case "prompt":
            //         error.push(term.prompt);
            //         continue;
            //     case "none":
            //         this.terms.push(term);
            // }
            const err = this.addTerm(term);
            if (err !== undefined) extantError.push(err);
        }
        if (extantError.length)
            caller.addSetError({
                setName: set.name,
                issue: "already exist(s)",
                errs: extantError,
            });
    }

    addTerm(term: Term): string | undefined {
        let extantTerm = this.getTerm(term.prompt);
        switch (extantTerm?.matches(term) ?? "none") {
            case "prompt":
                return term.prompt;
            case "none":
                this.terms.push(term);
                break;
            case "exactly":
        }
        return undefined;
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

    getMastery(): number {
        return (
            this.terms.reduce(
                (sum: number, term: Term) => sum + term.getMastery(),
                0,
            ) / this.terms.length
        );
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
    private errors: SetError[] = [];

    constructor(data: string, main: MainComponent) {
        data = data.replace(/^\s*/g, "");
        if (!data) return;
        for (let setStr of data.split("\n\n")) this.addOrUpdateSet(setStr);

        this.showAndResetErrors(main);
    }

    addOrUpdateSet(setData: string | Set): void {
        const newSet =
            setData instanceof Set ? setData : Set.fromTSV(setData, this);
        if (!newSet) return;
        for (let set of this.sets) {
            if (set.name === newSet.name) {
                set.merge(newSet, this);
                return;
            }
        }
        this.sets.push(newSet);
    }

    addSetError(error: SetError): void {
        this.errors.push(error);
    }

    showAndResetErrors(main: MainComponent): void {
        for (let error of this.errors)
            EzDialog.popup(
                main,
                error.errs.join("\n"),
                `In set "${error.setName}", the following term(s) ${error.issue}`,
            );
        this.errors = [];
    }

    static loadDatabase(main: MainComponent): Database {
        console.log("aaaa");
        console.log(window.localStorage.getItem("database"));
        console.log("aaaaaaaaaaaaaaaaaaaaaa");
        return new Database(
            window.localStorage.getItem("database") ?? "",
            main,
        );
    }

    merge(database: Database, main: MainComponent): void {
        for (let set of database.sets) {
            this.addOrUpdateSet(set);
        }
        main.saveDatabase();
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
