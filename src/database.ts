import { EzDialog } from "@gsilber/webez";
import { MainComponent } from "./app/main.component";
import {
    BEGUN,
    MASTERED,
    PROB_FACTOR_IF_ACTIVE_SET,
    QuestionType,
    getQuestionType,
    questionTypes,
} from "./question_types";
import { CharQComponent } from "./app/CharQ/CharQ.component";
import { EzError } from "./app/EzError/EzError.component";

/**
 * @description The JS window, used to get access to localStorage
 */
declare const window: Window;

/**
 * @description A way of pairing a term with its set name for use in Flashcards
 * @prop {Term} term The term
 * @prop {string} set The name of the set that the term comes from
 */
export type TermSet = {
    term: Term;
    set: string;
};

/**
 * @description A class representing a term
 * @class Term
 * @readonly @prop {string} answer The answer to the term
 * @readonly @prop {string} prompt The prompt for the term
 * @prop {boolean} confident Whether the user is confident in the term (for flashcards)
 * @prop {number} mastery The mastery in the form of an actually useful number
 * @prop {boolean} started Whether or not the user has actually started learning the term
 */
export class Term {
    /**
     * @description Creates an instance of Term
     * @readonly @param {string} answer The answer to the term; defaults to ""
     * @readonly @param {string} prompt The prompt for the term; defaults to ""
     * @private @param {number} _mastery The mastery of the term; `NaN` if not started; defaults to `NaN`
     * @param {boolean} confident Whether the user is confident in this term (for flashcards); defaults to `false`
     */
    constructor(
        readonly answer: string = "",
        readonly prompt: string = "",
        private _mastery: number = NaN,
        public confident: boolean = false,
    ) {}

    /**
     * @description Loads a term from a line of a TSV, returns undefined if something goes wrong
     * @param {string} data The TSV line
     * @returns {Term | undefined}
     * @memberof Term
     * @static
     */
    static fromTSV(data: string): Term | undefined {
        const dataArr = data.split("\t");
        if (dataArr.length < 2) {
            return undefined;
        }
        return new Term(
            dataArr[0],
            dataArr[1],
            parseFloat(dataArr[2]),
            !!dataArr[3],
        );
    }

    /**
     * @description Checks if/in what way a term matches this term
     * @param {Term} term The term we're checking against this term
     * @returns {{ prompt: boolean; answer: boolean }}
     * @memberof Term
     */
    matches(term: Term): { prompt: boolean; answer: boolean } {
        return {
            prompt: this.prompt === term.prompt,
            answer: this.answer === term.answer,
        };
    }

    /**
     * @description Randomly chooses a type of question to use with a distribution based on the current mastery
     * @returns {QuestionType}
     * @memberof Term
     */
    chooseQuestionType(): QuestionType {
        if (isNaN(this._mastery)) return getQuestionType("New Term");
        let probs: number[] = [];
        for (let i = 0; i < questionTypes.length; i++) {
            probs[i] =
                questionTypes[i].probability(this._mastery) +
                (probs[i - 1] ?? 0);
        }
        const random = Math.random() * (probs.at(-1) ?? 0);
        for (let i = 0; i < questionTypes.length; i++)
            if (probs[i] > random) return questionTypes[i];
        return questionTypes[questionTypes.length - 1];
    }

    /**
     * @description Updates the mastery/confidence of the term based on if the user was right and the QuestionType
     * @param {boolean} success Whether or not the user was successful (or confident)
     * @param {QuestionType | "Flashcard"} type The type of question or "Flashcard"
     * @param {MainComponent} main The main component of the site, to save the database after the update to this term
     * @returns {void}
     * @memberof Term
     */
    update(
        success: boolean,
        type: QuestionType | "Flashcard",
        main: MainComponent,
    ): void {
        if (type === "Flashcard") this.confident = success;
        else
            this._mastery = type.masteryUpdater(
                this._mastery,
                success,
                this.answer.length,
            );
        main.saveDatabase();
    }

    /**
     * @description The mastery in the form of an actually useful number (`BEGUN` for `NaN`); also sets `._mastery` if too low
     * @type {number}
     * @memberof Term
     */
    get mastery(): number {
        if (isNaN(this._mastery)) return BEGUN;
        if (this._mastery < MASTERED) this._mastery = MASTERED;
        return this._mastery;
    }

    /**
     * @description Whether or not the user has started learning this term
     * @type {boolean}
     * @memberof Term
     */
    get started(): boolean {
        return !isNaN(this._mastery);
    }

    /**
     * @description Gets all of the terms in the given sets that don't match this term and are started
     * @param {Set[]} sets The sets the user is studying from which to draw "allOptions"
     * @returns {Term[]}
     * @memberof Term
     */
    allOptions(sets: Set[]): Term[] {
        let allOptions: Term[] = [];
        sets.forEach((set: Set) => {
            set.terms.forEach((term: Term) => {
                if (!term.matches(this).prompt && term.started)
                    allOptions.push(term);
            });
        });
        return allOptions;
    }

    /**
     * @description Creates the proper TSV representation of this term for use in exporting and saving
     * @returns {string}
     * @memberof Term
     */
    toString(): string {
        return `${this.answer}\t${this.prompt}\t${this._mastery}\t${this.confident || ""}`;
    }
}

/**
 * @description A way of keeping track of errors that occur when importing things
 * @prop {string} message The name of the error that occured
 * @prop {string[]} errs The text to display for each of the errors that happened of the type specified in `message`
 */
type DatabaseError = {
    message: string;
    errs: string[];
};

/**
 * @description A way of categorising a group of sets into those that are mastered/confident and the first that isn't
 * @prop {Set[]} done The sets that are mastered/confident
 * @prop {Set | undefined} doing The first set that is not done (undefined if they're all done)
 */
type Categorised = { done: Set[]; doing: Set | undefined };
/**
 * @description A union of the different activites that can be performed on sets and groups for `List(Button)Component`
 */
export type Activities = "Practice" | "Flashcards" | "Delete";

/**
 * @description A class representing a set of terms
 * @class Set
 * @prop {string[]} allChars An array of all of the chars used in the set (so we can use them for CharQ)
 * @prop {number} prob The probability of choosing this set to get a term from, based on mastery and length
 * @prop {number} length The number of terms in this set (this.terms.length)
 * @prop {number} mastery The average mastery of the terms in the set
 * @prop {boolean} confident If the user is confident in *every* term in the set (for flashcards)
 */
// 44 more in this file alone; I'm going to cry ):
export class Set {
    private mastered: boolean;
    public allChars: string[] = [];

    constructor(
        readonly name: string,
        public terms: Term[] = [],
    ) {
        this.mastered = this.mastery === MASTERED;
    }

    static fromTSV(data: string, caller: Database): Set | undefined {
        data = data.replace(/^\s*/g, "");
        const dataArr = data.split("\n");
        const name = dataArr[0];
        if (!name) return undefined;

        let set = new Set(name);

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
            caller.addError({
                message: `In set "${set.name}", the following term(s) have/has bad data`,
                errs: dataError,
            });
        if (extantError.length)
            caller.addError({
                message: `In set "${set.name}", the following term(s) already exist(s)`,
                errs: extantError,
            });
        return set;
    }

    merge(set: Set, caller: Database): void {
        let extantError: string[] = [];
        for (let term of set.terms) {
            const err = this.addTerm(term);
            if (err !== undefined) extantError.push(err);
        }
        if (extantError.length)
            caller.addError({
                message: `In set "${set.name}", the following term(s) already exist(s)`,
                errs: extantError,
            });
    }

    addTerm(term: Term): string | undefined {
        let extantTermMatch = this.getTerm(term.prompt)?.matches(term) ?? {
            prompt: false,
            answer: false,
        };
        if (!extantTermMatch.prompt)
            this.terms.push(term); // Formerly case "none":
        else if (!extantTermMatch.answer) return term.prompt; // Formerly case "prompt":
        this.mastered = this.mastery === MASTERED;
        term.answer.split("").forEach((val: string) => {
            val = CharQComponent.buttonify(val);
            if (!this.allChars.includes(val)) this.allChars.push(val);
        });
        return undefined;
    }

    getTerm(prompt: string): Term | undefined {
        return this.terms.reduce((acc: Term | undefined, term) => {
            return term.prompt === prompt ? term : acc;
        }, undefined);
    }

    chooseTerm(onlyNew: boolean = false): Term | undefined {
        let probs: number[] = [];
        for (let term of this.terms)
            probs.push(
                (onlyNew ? +!term.started : term.mastery) + (probs.at(-1) ?? 0),
            );
        const random = Math.random() * (probs.at(-1) ?? 0);
        for (let i = 0; i < this.length; i++)
            if (probs[i] > random) return this.terms[i];
        return undefined;
    }

    static categorise(sets: Set[], by: "mastered" | "confident"): Categorised {
        let out: Categorised = { done: [], doing: undefined };
        for (let set of sets) {
            if (set[by]) {
                out.done.push(set);
            } else {
                out.doing = set;
                break;
            }
        }
        return out;
    }

    static randomSet(sets: Categorised): Set {
        if (sets instanceof Array) sets = { done: sets, doing: undefined };
        let probs: number[] = [];
        for (let set of sets.done) probs.push(set.prob + (probs.at(-1) ?? 0));
        if (sets.doing !== undefined) {
            sets.done.push(sets.doing);
            probs.push(
                sets.doing.prob * PROB_FACTOR_IF_ACTIVE_SET +
                    (probs.at(-1) ?? 0),
            );
        }
        let out = sets.done;
        const random = Math.random() * (probs.at(-1) ?? 0);
        for (let i = 0; i < out.length; i++)
            if (probs[i] > random) return out[i];
        return out.at(-1)!;
    }

    get prob(): number {
        return this.length * this.mastery;
    }

    get length(): number {
        return this.terms.length;
    }

    get mastery(): number {
        return (
            this.terms.reduce(
                (sum: number, term: Term) => sum + term.mastery,
                0,
            ) / this.length
        );
    }

    get confident(): boolean {
        return this.terms.every((term: Term) => term.confident);
    }

    justMastered(): boolean {
        if (this.mastered) return false;
        return (this.mastered = this.mastery === MASTERED);
    }

    toString(): string {
        return (
            this.name +
            "\n" +
            this.terms.map((term: Term) => term.toString()).join("\n")
        );
    }
}

class Divide {
    constructor(
        public numerator: number,
        public denominator: number,
    ) {}
    evaluate(): number {
        return this.numerator / this.denominator;
    }
}
export class Group {
    private mastered: boolean;

    constructor(
        readonly name: string,
        private _sets: string[] = [],
        private database?: Database,
    ) {
        this.mastered = this.mastery === MASTERED;
    }

    static fromTSV(data: string, database: Database): Group | undefined {
        const dataArr = data.replace(/\s+$/, "").split(/[\t\n]+/g);
        const name = dataArr[0];
        if (!name) return undefined;
        return new Group(name, dataArr.slice(1), database);
    }

    overwrite(group: Group, caller: Database): void {
        if (caller !== this.database || caller !== this.database)
            throw new EzError(
                `Attempt to merge group "${group.name}" into an external database.`,
            );
        this._sets = group._sets;
    }

    get sets(): Set[] {
        if (!this.database) return [];
        let errors: string[] = [];
        const out = this._sets
            .map((setName: string) => {
                const set = this.database!.getSet(setName);
                if (!set) errors.push(setName);
                return set;
            })
            .filter((set) => set) as Set[];
        if (errors.length)
            this.database.addError({
                message: `For group "${this.name}", the following set(s) do(es) not exist in the database`,
                errs: errors,
            });
        return out;
    }

    get mastery(): number {
        if (!this.database) return NaN;
        return this.sets
            .reduce(
                (div: Divide, set: Set) => {
                    return new Divide(
                        div.numerator + set.mastery,
                        div.denominator + set.length,
                    );
                },
                new Divide(0, 0),
            )
            .evaluate();
    }

    toString(): string {
        return `${this.name}\t${this._sets.join("\t")}`;
    }
}

export type Constructor<T extends Set | Group> = { new (name: string): T };

export class Database {
    public sets: Set[] = [];
    public groups: Group[] = [];
    private errors: DatabaseError[] = [];

    constructor(data: string, main: MainComponent) {
        data = data.replace(/(^[^\S\n]+)|([^\S\n]+$)/gm, "");
        if (!data) return;
        const dataArr = data.split("\n\n");
        for (let setStr of dataArr.slice(1)) this.addOrUpdateSet(setStr);
        for (let groupStr of dataArr[0].split("\n"))
            this.addOrUpdateGroup(groupStr);

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

    addOrUpdateGroup(groupData: string | Group): void {
        const newGroup =
            groupData instanceof Group ? groupData : (
                Group.fromTSV(groupData, this)
            );
        if (!newGroup) return;
        for (let group of this.groups) {
            if (group.name === newGroup.name) {
                group.overwrite(newGroup, this);
                return;
            }
        }
        this.groups.push(newGroup);
    }

    addError(error: DatabaseError): void {
        this.errors.push(error);
    }

    showAndResetErrors(main: MainComponent): void {
        for (let error of this.errors)
            EzDialog.popup(main, error.errs.join("<br>"), error.message);
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
        for (let group of database.groups) {
            this.addOrUpdateGroup(group);
        }
        main.saveDatabase();
    }

    getSet(setName: string): Set | undefined {
        return this.sets.find((set: Set) => set.name === setName);
    }

    delete(item: Set | Group): void {
        const del = <X extends Set | Group>(list: X[]): X[] =>
            list.filter((v: X) => v !== item);
        this.sets = del(this.sets);
        this.groups = del(this.groups);
    }

    save(): void {
        window.localStorage.setItem("database", this.toString());
    }

    toString(): string {
        return `${this.groups.map((group: Group) => group.toString()).join("\n")}

${this.sets.map((set: Set) => set.toString()).join("\n\n")}`;
    }
}

export function randomSetAndTerm(sets: Set[], onlyNew: boolean): [Term, Set] {
    const categorised = Set.categorise(sets, "mastered");
    const set = onlyNew ? categorised.doing : Set.randomSet(categorised);
    const term = set?.chooseTerm(onlyNew);
    if (!set || !term)
        throw new Error("There are insufficient terms in your set(s).");
    return [term, set];
}
