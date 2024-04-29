import { describe, expect, test, beforeAll } from "@jest/globals";
import { ListButtonComponent } from "./list-button.component";
import { bootstrap } from "@gsilber/webez";
import { Set } from "../../database";

describe("ListButtonComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<ListButtonComponent<Set>>(
            ListButtonComponent,
            html,
        );
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(ListButtonComponent);
        });
    });
});
