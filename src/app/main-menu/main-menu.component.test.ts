import { describe, expect, test, beforeAll, beforeEach } from "@jest/globals";
import { MainMenuComponent } from "./main-menu.component";
import { bootstrap } from "@gsilber/webez";
import { MainComponent } from "../main.component";

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

describe("Main Component", () => {
    let component: MainComponent;
    beforeEach(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<MainComponent>(MainComponent, html);
    });

    test("Contaned in MainComponent", () => {
        expect(component["mainMenu"]).toBeDefined();
        expect(component["mainMenu"]).toBeInstanceOf(MainMenuComponent);
    });

    test("It's been put into the 'page'", () => {
        const element = component["shadow"].getElementById(
            "page",
        ) as HTMLElement;
        expect(element).not.toBeNull();
    });
});
