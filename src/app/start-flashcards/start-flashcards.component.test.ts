import { describe, expect, test, beforeAll } from "@jest/globals";
import { StartFlashcardsComponent } from "./start-flashcards.component";
import { bootstrap } from "@gsilber/webez";

describe("StartFlashcardsComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<StartFlashcardsComponent>(StartFlashcardsComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(StartFlashcardsComponent);
        });
    });
});
