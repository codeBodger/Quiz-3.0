import { EzComponent } from "@gsilber/webez";
import html from "./main-menu.component.html";
import css from "./main-menu.component.css";

export class MainMenuComponent extends EzComponent {
    constructor() {
        super(html, css);
    }
}
