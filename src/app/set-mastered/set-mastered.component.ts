import html from "./set-mastered.component.html";
import css from "./set-mastered.component.css";
import { PageComponet } from "../../EzComponent_subclasses";
import { MainComponent } from "../main.component";
import { BindValue, Click } from "@gsilber/webez";
import { Set } from "../../database";

export class SetMasteredComponent extends PageComponet {
    @BindValue("name")
    private name: string = "";

    constructor(
        name: string,
        private sets: Set[],
        main: MainComponent,
    ) {
        super(main, html, css);
        this.name = name;
    }

    @Click("continue")
    continue(): void {
        this.main.askFrom(this.sets);
    }

    onExit(): void {
        return;
    }
}
