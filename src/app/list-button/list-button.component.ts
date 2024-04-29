import html from "./list-button.component.html";
import css from "./list-button.component.css";
import { SubComponent } from "../../EzComponent_subclasses";
import { SetListComponent } from "../set-list/set-list.component";
import { MainComponent } from "../main.component";
import { BindValue, Click } from "@gsilber/webez";
import { Set } from "../../database";

export class ListButtonComponent<X extends Set> extends SubComponent {
    @BindValue("act")
    private readonly name;

    constructor(
        readonly x: X,
        protected parent: SetListComponent,
        main: MainComponent,
    ) {
        super(parent, main, html, css);
        this.name = x.name;
    }

    @Click("act")
    act(): void {
        this.parent.act(this.x);
    }
}
