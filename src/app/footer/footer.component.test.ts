import { describe, expect, test, beforeAll } from "@jest/globals";
import { FooterComponent } from "./footer.component";
import { bootstrap } from "@gsilber/webez";

describe("FooterComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<FooterComponent>(FooterComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(FooterComponent);
        });
    });
});
