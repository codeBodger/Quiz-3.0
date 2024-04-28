import { describe, expect, test, beforeAll } from "@jest/globals";
import { TFQComponent } from "./TFQ.component";
import { bootstrap } from "@gsilber/webez";

describe("TFQComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<TFQComponent>(TFQComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(TFQComponent);
        });
    });
});
