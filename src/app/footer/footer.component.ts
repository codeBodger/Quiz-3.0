import { Click } from "@gsilber/webez";
import html from "./footer.component.html";
import css from "./footer.component.css";
import { MainComponent } from "../main.component";
import { SubComponent } from "../../EzComponent_subclasses";

export class FooterComponent extends SubComponent {
    constructor(parent: MainComponent) {
        super(parent, html, css);
    }

    @Click("exit")
    private exit() {
        this.main.exit();
    }
}
