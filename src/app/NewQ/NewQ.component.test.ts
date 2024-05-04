import { describe, expect, test, beforeAll } from "@jest/globals";
import { NewQComponent } from "./NewQ.component";
import { bootstrap } from "@gsilber/webez";

describe("NewQComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<NewQComponent>(NewQComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(NewQComponent);
        });
    });
});
