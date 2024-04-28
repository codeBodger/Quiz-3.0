import { describe, expect, test, beforeAll } from "@jest/globals";
import { MCQComponent } from "./MCQ.component";
import { bootstrap } from "@gsilber/webez";

describe("MCQComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<MCQComponent>(MCQComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(MCQComponent);
        });
    });
});
