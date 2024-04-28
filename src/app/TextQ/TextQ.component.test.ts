import { describe, expect, test, beforeAll } from "@jest/globals";
import { TextQComponent } from "./TextQ.component";
import { bootstrap } from "@gsilber/webez";

describe("TextQComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<TextQComponent>(TextQComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(TextQComponent);
        });
    });
});
