import { describe, expect, test, beforeAll } from "@jest/globals";
import { SetListComponent } from "./set-list.component";
import { bootstrap } from "@gsilber/webez";

describe("SetListComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<SetListComponent>(SetListComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(SetListComponent);
        });
    });
});
