import { EzError } from "./app/EzError/EzError.component";

const types = [
    "New Term",
    "Multiple Choice",
    "True/False",
    "Matching",
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
export const PROB_FACTOR_IF_ACTIVE_SET = 5;
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

// Probabilities taken from https://github.com/codeBodger/Quiz-2/blob/main/public/index.html#L95
export const questionTypes: QuestionType[] = [
    new QuestionType(
        "New Term",
        () => MASTERED,
        () => BEGUN,
        () => 0,
    ),
    new QuestionType(
        "Multiple Choice",
        (mastery) => mastery / 1.2,
        (mastery) => mastery * 1.2,
        (mastery) => {
            return (
                (0.00143777949286 *
                    1.00000129498 ** (0.999999999351 * mastery) +
                    0.068712710965) /
                    (1 + Math.exp((mastery - 5400000) / 267000)) +
                Math.max(
                    (-mastery / 10000000 + 1.5) /
                        (1 + Math.exp((5400000 - mastery) / 267000)),
                    0,
                )
            );
        },
    ),
    new QuestionType(
        "True/False",
        (mastery) => mastery / 1.1,
        (mastery) => mastery * 1.1,
        (mastery) => {
            if (mastery <= 4900000)
                return (
                    (0.0000118792037493 *
                        1.00000237726 ** (1.00002886058 * mastery) +
                        0.0484599092371) /
                    (1 + Math.exp((mastery - 4280000) / 139000))
                );
            if (mastery < 5100000) return 0;
            return mastery / 10000000 - 0.5;
        },
    ),
    new QuestionType(
        "Matching",
        (mastery) => mastery / 1.15,
        (mastery) => mastery * 1.15,
        (mastery) => {
            if (mastery <= 4800000)
                return (
                    (4 * // is this `4 *` for getting the other two?
                        (0.00169055154464 *
                            1.00000126005 ** (1.00000036691 * mastery) +
                            0.046476040631)) /
                    (1 + Math.exp((mastery - 4370000) / 139000))
                );
            return 0;
        },
    ),
    // new QuestionType(
    //     "Letter Entry",
    //     (mastery) => mastery / 1.7,
    //     (mastery) => mastery * 1.7,
    //     (mastery) => {
    //         if (mastery <= 3700000)
    //             return (
    //                 (-0.248136529594 *
    //                     1.00000332632 ** (-0.375173221214 * mastery) +
    //                     0.327403990272) /
    //                     (1 + Math.exp((mastery - 3900000) / 300000)) -
    //                 (Math.exp(-(((mastery - 3120000) / 600000) ** 2)) *
    //                     (mastery - 3120000)) /
    //                     1700000
    //             );
    //         return 0;
    //     },
    // ),
    new QuestionType(
        "Text Entry",
        (mastery) => mastery / 2,
        (mastery) => mastery * 2,
        (mastery) => {
            if (mastery <= 2900000)
                return (
                    (145855.62689 / (mastery + 349629.950477) +
                        0.348277639381) /
                    (1 + Math.exp((mastery - 2537083.91759) / 204000))
                );
            return 0;
        },
    ),
] as const;

export function getQuestionType(name: QuestionTypes): QuestionType {
    for (let type of questionTypes) {
        if (type.name === name) return type;
    }
    throw new EzError(`Invalid question type: ${name}`);
}

export function checkImplementation(): void {
    for (let name of types) {
        getQuestionType(name);
    }
}
