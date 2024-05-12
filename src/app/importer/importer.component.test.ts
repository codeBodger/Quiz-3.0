import { describe, expect, test, beforeAll } from "@jest/globals";
import { ImporterComponent } from "./importer.component";
import { bootstrap } from "@gsilber/webez";
import { Set } from "../../database";

describe("ImporterComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<ImporterComponent<Set>>(ImporterComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(ImporterComponent);
        });
    });
});
