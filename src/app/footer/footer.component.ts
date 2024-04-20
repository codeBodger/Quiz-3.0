import { Click } from "@gsilber/webez";
import html from "./footer.component.html";
import css from "./footer.component.css";
import { MainComponent } from "../main.component";
import { SubComponent } from "../../subcomponent";

export class FooterComponent extends SubComponent {
    constructor(parent: SubComponent | MainComponent, main: MainComponent) {
        super(parent, main, html, css);
    }

    @Click("exit")
    private exit() {
        this.main.exit();
    }
}
