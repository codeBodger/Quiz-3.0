import { describe, expect, test, beforeAll } from "@jest/globals";
import { ListComponent } from "./set-list.component";
import { bootstrap } from "@gsilber/webez";
import { Set } from "../../database";

describe("SetListComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<ListComponent<Set>>(ListComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(ListComponent);
        });
    });
});
