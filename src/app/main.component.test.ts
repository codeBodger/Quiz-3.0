import { describe, expect, test, beforeEach } from "@jest/globals";
import { MainComponent } from "./main.component";
import { bootstrap } from "@gsilber/webez";
import { PageComponet } from "../EzComponent_subclasses";

describe("MainComponent", () => {
    let component: any = undefined;
    let pageElement: HTMLElement;
    let childElement = () => pageElement.firstChild as HTMLElement;
    const html1 = "<div>a page</div>";
    const html2 = "<p>a different page</p>";
    let page1: PageComponet;
    let page2: PageComponet;
    beforeEach(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<MainComponent>(MainComponent, html);
        component["freePage"]();
        pageElement = component["shadow"].getElementById("page") as HTMLElement;
        // page1 = new PageComponet(component, html1, "");
        // page2 = new PageComponet(component, html2, "");
    });

    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(MainComponent);
        });
    });

    describe("activate", () => {
        test("exists", () => {
            expect(component["activate"]).toBeDefined();
            expect(typeof component["activate"]).toBe("function");
        });
        test("replaces element", () => {
            expect(pageElement.innerHTML).toBe("");
            expect(childElement()).toBe(null);
            component["activate"](page1);
            expect(pageElement.innerHTML).toBe("<div></div>");
            expect(
                childElement().shadowRoot?.getElementById("rootTemplate")
                    ?.innerHTML,
            ).toBe(html1);
            component["activate"](page2);
            expect(pageElement.innerHTML).toBe("<div></div>");
            expect(
                childElement().shadowRoot?.getElementById("rootTemplate")
                    ?.innerHTML,
            ).toBe(html2);
            component["activate"](page1);
            expect(pageElement.innerHTML).toBe("<div></div>");
            expect(
                childElement().shadowRoot?.getElementById("rootTemplate")
                    ?.innerHTML,
            ).toBe(html1);
        });
    });

    describe("freePage", () => {
        test("exists", () => {
            expect(component["freePage"]).toBeDefined();
            expect(typeof component["freePage"]).toBe("function");
        });
        test("clears page", () => {
            expect(pageElement.innerHTML).toBe("");
            expect(childElement()).toBe(null);
            component.addComponent(page1, "page");
            expect(pageElement.innerHTML).toBe("<div></div>");
            expect(
                childElement().shadowRoot?.getElementById("rootTemplate")
                    ?.innerHTML,
            ).toBe(html1);
            component["freePage"]();

            expect(pageElement.innerHTML).toBe("");
            expect(childElement()).toBe(null);
            component.addComponent(page2, "page");
            expect(pageElement.innerHTML).toBe("<div></div>");
            expect(
                childElement().shadowRoot?.getElementById("rootTemplate")
                    ?.innerHTML,
            ).toBe(html2);
            component["freePage"]();
            expect(pageElement.innerHTML).toBe("");
            expect(childElement()).toBe(null);
        });
    });
});
