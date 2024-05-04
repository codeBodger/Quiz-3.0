import { OverlayError } from "./EzComponent_subclasses";

const types = [
    "New Term",
    "Multiple Choice",
    "True/False",
    // "Matching",
    // "Letter Entry",
    "Text Entry",
] as const;

// type QuestionTypes =
//     | "New Term"
//     | "Multiple Choice"
//     | "True/False"
//     | "Text Entry";
export type QuestionTypes = (typeof types)[number];

export const BEGUN = 5_000_000;
export const MASTERED = 100_000;
export class QuestionType {
    constructor(
        public readonly name: QuestionTypes,
        private onSuccess: (mastery: number) => number = (n) => n,
        private onFailure: (mastery: number) => number = (n) => n,
        public probability: (mastery: number) => number = () => 0,
    ) {}

    masteryUpdater(mastery: number, success: boolean): number {
        const out = success ? this.onSuccess(mastery) : this.onFailure(mastery);
        return out < MASTERED ? MASTERED : out;
    }
}

export const questionTypes: QuestionType[] = [
    new QuestionType(
        "New Term",
        () => MASTERED,
        () => BEGUN,
        () => 1,
    ),
    new QuestionType(
        "Multiple Choice",
        (mastery) => mastery / 1.2,
        (mastery) => mastery * 1.2,
        () => 1,
    ),
    new QuestionType(
        "True/False",
        (mastery) => mastery / 1.1,
        (mastery) => mastery * 1.1,
        () => 1,
    ),
    // new QuestionType(
    //     "Matching",
    //     (mastery) => mastery / 1.15,
    //     (mastery) => mastery * 1.15,
    //     () => 1,
    // ),
    // new QuestionType(
    //     "Letter Entry",
    //     (mastery) => mastery / 1.7,
    //     (mastery) => mastery * 1.7,
    //     () => 1,
    // ),
    new QuestionType(
        "Text Entry",
        (mastery) => mastery / 2,
        (mastery) => mastery * 2,
        () => 1,
    ),
] as const;

export function getQuestionType(name: QuestionTypes): QuestionType {
    for (let type of questionTypes) {
        if (type.name === name) return type;
    }
    new OverlayError(`Invalid question type: ${name}`);
    return new QuestionType("New Term");
}

export function checkImplementation(): void {
    for (let name of types) {
        getQuestionType(name);
    }
}
