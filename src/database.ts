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
 * @readonly @prop {string} name The name of the set
 * @prop {Term[]} terms The terms contained within the set
 * @prop {number} prob The probability of choosing this set to get a term from, based on mastery and length
 * @prop {number} length The number of terms in this set (this.terms.length)
 * @prop {number} mastery The average mastery of the terms in the set
 * @prop {boolean} confident If the user is confident in *every* term in the set (for flashcards)
 */
export class Set {
    /**
     * @description Whether or not the set is mastered (only set to false on load)
     * @type {boolean}
     * @memberof Set
     * @private
     */
    private mastered: boolean;

    /**
     * @description An array of all of the chars used in the set (so we can use them for CharQ)
     * @type {string[]}
     * @memberof Set
     */
    public allChars: string[] = [];

    /**
     * @description Creates an instance of Set
     * @readonly @param {string} name The name of this set
     * @param {Term[]} terms The terms in this set, defaults to empty
     * @memberof Set
     * @constructor
     */
    constructor(
        readonly name: string,
        public terms: Term[] = [],
    ) {
        this.mastered = this.mastery === MASTERED;
    }

    /**
     * @description Loads a set from an appropriate TSV representation, returns undefined the name can't exist
     * @param {string} data The TSV data
     * @param {Database} caller The database that called this method, so we can tell it about the errors
     * @returns {Set | undefined}
     * @memberof Set
     * @static
     */
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

    /**
     * @description Merges another set into this one; adds terms with new prompts, displays an error for old prompts with new answers
     * @param {Set} set The set to merge into this one
     * @param {Database} caller The database that called this method, so we can tell it about the errors
     * @returns {void}
     * @memberof Set
     */
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

    /**
     * @description Adds a term to this set (`undefined` on success)
     * @param {Term} term The term to be added
     * @returns {string | undefined}
     * @memberof Set
     * @summary Returns the prompt if the prompt exists with a different answer,
     * does nothing if the prompt exists with the same prompt; the term already exists!
     */
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

    /**
     * @description Gets a term given the prompt; `undefined` if none found
     * @param {string} prompt The prompt to find the term with
     * @returns {string | undefined}
     * @memberof Set
     */
    getTerm(prompt: string): Term | undefined {
        return this.terms.reduce((acc: Term | undefined, term) => {
            return term.prompt === prompt ? term : acc;
        }, undefined);
    }

    /**
     * @description Gets a random term from the set weighted by the terms' masteries; `undefined` if something goes wrong
     * @param {boolean} onlyNew Whether we're only looking for terms that haven't been started (defaults to false)
     * @returns {Term | undefined}
     * @memberof Set
     */
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

    /**
     * @description Generates an object of type `Categorised` from an array of sets
     * @param {Set[]} sets The sets to categorise
     * @param {"mastered" | "confident"} by The way to categorise them, either by if they're mastered or deemed confident
     * @returns {Categorised}
     * @memberof Set
     */
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

    /**
     * @description Gets a random set from a Categorised object, considering `Set.prob` and favouring `Categorised.doing`
     * @param {Categorised} sets The categorised sets to take a random one from
     * @returns {Set}
     * @memberof Set
     * @static
     */
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

    /**
     * @description The probability of choosing this set to get a term from, based on mastery and length
     * @type {number}
     * @memberof Set
     */
    get prob(): number {
        return this.length * this.mastery;
    }

    /**
     * @description The number of terms in this set (this.terms.length)
     * @type {number}
     * @memberof Set
     */
    get length(): number {
        return this.terms.length;
    }

    /**
     * @description The average mastery of the terms in the set
     * @type {number}
     * @memberof Set
     */
    get mastery(): number {
        return (
            this.terms.reduce(
                (sum: number, term: Term) => sum + term.mastery,
                0,
            ) / this.length
        );
    }

    /**
     * @description If the user is confident in *every* term in the set (for flashcards)
     * @type {boolean}
     * @memberof Set
     */
    get confident(): boolean {
        return this.terms.every((term: Term) => term.confident);
    }

    /**
     * @description Whether the set was *just* mastered; sets `this.mastered`
     * @returns {boolean}
     * @memberof Set
     */
    justMastered(): boolean {
        if (this.mastered) return false;
        return (this.mastered = this.mastery === MASTERED);
    }

    /**
     * @description Creates the proper TSV representation of this set for use in exporting and saving
     * @returns {string}
     * @memberof Set
     */
    toString(): string {
        return (
            this.name +
            "\n" +
            this.terms.map((term: Term) => term.toString()).join("\n")
        );
    }
}

/**
 * @description A class for use in `reduce` to divide something
 * @prop {number} numerator The numerator of the division
 * @prop {number} denominator The denominator of the division
 * @class Divide
 */
class Divide {
    /**
     * @description Creates an instance of Divide
     * @param {number} numerator The numerator of the division
     * @param {number} denominator The denominator of the division
     * @memberof Divide
     * @constructor
     */
    constructor(
        public numerator: number,
        public denominator: number,
    ) {}

    /**
     * @description Evaluates the division
     * @returns {number}
     * @memberof Divide
     */
    evaluate(): number {
        return this.numerator / this.denominator;
    }
}

// 25 more in this file alone; I'm going to cry ):
/**
 * @description A class representing a group of sets (does not actually contain sets, just their names)
 * @class Set
 * @readonly @prop {string} name The name of the group
 * @prop {Set[]} sets The actual sets of the group, retrieved dynamically from the database
 * @prop {number} mastery The mastery of the group, a weighted average of the sets based on their lengths
 */
export class Group {
    /**
     * @description Whether or not this group is mastered (not used yet, will be used when I have a component for group-mastered)
     * @type {boolean}
     * @memberof Group
     */
    private mastered: boolean;

    /**
     * @description Creates an instance of Group
     * @readonly @param {string} name The name of the group
     * @private @param {string[]} _sets The *names* of the sets within the group, defaults to empty
     * @private @param {Database} database The database from which to get the actual sets, can be undefined in certain circumstances
     * @memberof Group
     * @constructor
     */
    constructor(
        readonly name: string,
        private _sets: string[] = [],
        private database?: Database,
    ) {
        this.mastered = this.mastery === MASTERED;
    }

    /**
     * @description Loads a group from an appropriate TSV representation, returns undefined the name can't exist
     * @param {string} data The TSV data
     * @param {Database} database The database to attach the newly created group to
     * @returns {Group | undefined}
     * @memberof Group
     * @static
     */
    static fromTSV(data: string, database: Database): Group | undefined {
        const dataArr = data.replace(/\s+$/, "").split(/[\t\n]+/g);
        const name = dataArr[0];
        if (!name) return undefined;
        return new Group(name, dataArr.slice(1), database);
    }

    /**
     * @description Overwrites the set name list of this group with that of the provided group (throws an error if the databases don't match)
     * @param {Group} group The group to effectively replace this one with
     * @param {Database} caller The database that called this method, for more insurance that it's being called from somewhere that makes sense
     * @returns {void}
     * @memberof Group
     */
    overwrite(group: Group, caller: Database): void {
        if (caller !== this.database || caller !== this.database)
            throw new EzError(
                `Attempt to merge group "${group.name}" into an external database.`,
            );
        this._sets = group._sets;
    }

    /**
     * @description Gets the actual sets from the database, given the set names here; adds errors to the database if not found
     * @type {Set[]}
     * @memberof Group
     */
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

    /**
     * @description The mastery of the group, a weighted average of the sets based on their lengths
     * @type {number}
     * @memberof Group
     */
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

    /**
     * @description Creates the proper TSV representation of this group for use in exporting and saving
     * @returns {string}
     * @memberof Group
     */
    toString(): string {
        return `${this.name}\t${this._sets.join("\t")}`;
    }
}

/**
 * @description A basic constructor for either `Set` or `Group`, for use here or elsewhwere to dynamically create the right one
 */
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
