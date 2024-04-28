import { describe, expect, test, beforeAll } from "@jest/globals";
import { SetImporterComponent } from "./set-importer.component";
import { bootstrap } from "@gsilber/webez";

describe("SetImporterComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<SetImporterComponent>(SetImporterComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(SetImporterComponent);
        });
    });
});
