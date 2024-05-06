import { describe, expect, test, beforeAll } from "@jest/globals";
import { MatchQComponent } from "./MatchQ.component";
import { bootstrap } from "@gsilber/webez";

describe("MatchQComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<MatchQComponent>(MatchQComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(MatchQComponent);
        });
    });
});
