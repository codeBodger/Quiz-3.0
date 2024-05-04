import { describe, expect, test, beforeAll } from "@jest/globals";
import { SetMasteredComponent } from "./set-mastered.component";
import { bootstrap } from "@gsilber/webez";

describe("SetMasteredComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<SetMasteredComponent>(SetMasteredComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(SetMasteredComponent);
        });
    });
});
