import { Click, EzComponent } from "@gsilber/webez";
import html from "./footer.component.html";
import css from "./footer.component.css";
import { MainComponent } from "../main.component";

export class FooterComponent extends EzComponent {
    constructor(private main: MainComponent) {
        super(html, css);
    }

    @Click("exit")
    private exit() {
        this.main.exit();
    }
}
