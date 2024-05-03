import { describe, expect, test, beforeAll } from "@jest/globals";
import { DatabaseImporterComponent } from "./database-importer.component";
import { bootstrap } from "@gsilber/webez";

describe("DatabaseImporterComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<DatabaseImporterComponent>(DatabaseImporterComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(DatabaseImporterComponent);
        });
    });
});
