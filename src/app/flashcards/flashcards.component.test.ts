import { describe, expect, test, beforeAll } from "@jest/globals";
import { FlashcardsComponent } from "./flashcards.component";
import { bootstrap } from "@gsilber/webez";

describe("FlashcardsComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<FlashcardsComponent>(FlashcardsComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(FlashcardsComponent);
        });
    });
});
