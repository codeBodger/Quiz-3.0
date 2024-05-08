import { describe, expect, test, beforeAll } from "@jest/globals";
import { CharQComponent } from "./CharQ.component";
import { bootstrap } from "@gsilber/webez";

describe("CharQComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<CharQComponent>(CharQComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(CharQComponent);
        });
    });
});
