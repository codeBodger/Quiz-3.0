import { EzDialog } from "@gsilber/webez";
import { MainComponent } from "./app/main.component";

export class Term {
    public index: number = -1;
    constructor(
        readonly answer: string,
        readonly prompt: string,
        private mastery: number | undefined,
    ) {
        this.mastery = isNaN(mastery ?? NaN) ? 5_000_000 : mastery;
    }

    static fromTSV(main: MainComponent): (data: string) => Term {
        return (data: string) => {
            const dataArr = data.split("\t");
            if (dataArr.length < 2) {
                EzDialog.popup(main, `Bad term data: ${data}`);
            }
            return new Term(dataArr[0], dataArr[1], parseFloat(dataArr[2]));
        };
    }

    matches(term: Term): "exactly" | "prompt" | "none" {
        if (this.prompt === term.prompt) {
            if (this.answer === term.answer) return "exactly";
            return "prompt";
        }
        return "none";
    }
}

export class Set {
    constructor(
        readonly name: string,
        private terms: Term[] = [],
    ) {}

    static fromTSV(data: string, main: MainComponent): Set {
        const dataArr = data.split("\n");
        const name = dataArr[0];
        const termArr = dataArr.slice(1).map(Term.fromTSV(main));
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
    }

    getTerm(prompt: string): Term | undefined {
        return this.terms.reduce((acc: Term | undefined, term, i) => {
            term.index = i;
            return term.prompt === prompt ? term : acc;
        }, undefined);
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
    }

    static loadDatabase(main: MainComponent): Database {
        return new Database(
            main["htmlElement"].localStorage.getItem("database"),
            main,
        );
    }
}
