import { describe, expect, test, beforeEach } from "@jest/globals";
import { FooterComponent } from "./footer.component";
import { bootstrap } from "@gsilber/webez";
import { MainComponent } from "../main.component";

describe("FooterComponent", () => {
    let component: any = undefined;
    beforeEach(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<FooterComponent>(FooterComponent, html);
    });

    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(FooterComponent);
        });
    });

    test("exit button", () => {
        const button = component["shadow"].getElementById(
            "exit",
        ) as HTMLButtonElement;
        const pageElement = component["main"]["shadow"].getElementById(
            "page",
        ) as HTMLElement;
        let childElement = () => pageElement.firstChild as HTMLElement;
        button.click();
        expect(
            childElement().shadowRoot?.getElementById("main-menu"),
        ).not.toBeNull();
    });
});

describe("Main Component", () => {
    let component: MainComponent;
    beforeEach(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<MainComponent>(MainComponent, html);
    });

    test("Contaned in MainComponent", () => {
        expect(component["footer"]).toBeDefined();
        expect(component["footer"]).toBeInstanceOf(FooterComponent);
    });

    test("It's been put into the 'page'", () => {
        const element = component["shadow"].getElementById(
            "page",
        ) as HTMLElement;
        expect(element).not.toBeNull();
    });
});
