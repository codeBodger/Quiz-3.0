import { describe, expect, test, beforeAll } from "@jest/globals";
import { MainMenuComponent } from "./main-menu.component";
import { bootstrap } from "@gsilber/webez";

describe("MainMenuComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<MainMenuComponent>(MainMenuComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(MainMenuComponent);
        });
    });
});
