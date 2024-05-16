import html from "./list-button.component.html";
import css from "./list-button.component.css";
import { SubComponent } from "../../EzComponent_subclasses";
import { ListComponent } from "../list/list.component";
import { BindValue, Click } from "@gsilber/webez";
import { Group, Set } from "../../database";

export class ListButtonComponent<X extends Set | Group> extends SubComponent {
    @BindValue("act")
    private readonly name;

    constructor(
        readonly x: X,
        protected parent: ListComponent<X>,
    ) {
        super(parent, html, css);
        this.name = x.name;
    }

    @Click("act")
    act(): void {
        this.parent.act(this.x);
    }
}
