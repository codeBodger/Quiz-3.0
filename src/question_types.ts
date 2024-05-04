import { OverlayError } from "./EzComponent_subclasses";

const types = [
    "New Term",
    "Multiple Choice",
    "True/False",
    "Text Entry",
] as const;

// type QuestionTypes =
//     | "New Term"
//     | "Multiple Choice"
//     | "True/False"
//     | "Text Entry";
export type QuestionTypes = (typeof types)[number];

export class QuestionType {
    constructor(
        public readonly name: QuestionTypes,
        private onSuccess: (mastery: number) => number = (n) => n,
        private onFailure: (mastery: number) => number = (n) => n,
        public probability: (mastery: number) => number = () => 0,
    ) {}

    masteryUpdater(mastery: number, success: boolean): number {
        return success ? this.onSuccess(mastery) : this.onFailure(mastery);
    }
}

export const questionTypes: QuestionType[] = [
    new QuestionType(
        "New Term",
        () => 5_000,
        () => 5_000_000,
        () => 1,
    ),
    new QuestionType(
        "Multiple Choice",
        (mastery) => mastery * 0.8,
        (mastery) => mastery * 1.2,
        () => 1,
    ),
    new QuestionType(
        "True/False",
        (mastery) => mastery * 0.9,
        (mastery) => mastery * 1.1,
        () => 1,
    ),
    new QuestionType(
        "Text Entry",
        (mastery) => mastery * 0.6,
        (mastery) => mastery * 1.2,
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
