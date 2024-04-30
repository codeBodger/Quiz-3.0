import { describe, expect, test, beforeAll } from "@jest/globals";
import { AnswerComponent } from "./answer.component";
import { bootstrap } from "@gsilber/webez";

describe("AnswerComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<AnswerComponent>(AnswerComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(AnswerComponent);
        });
    });
});
