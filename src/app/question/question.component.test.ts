import { describe, expect, test, beforeAll } from "@jest/globals";
import { QuestionComponent } from "./question.component";
import { bootstrap } from "@gsilber/webez";

describe("QuestionComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<QuestionComponent>(QuestionComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(QuestionComponent);
        });
    });
});
