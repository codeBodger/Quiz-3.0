import html from "./main-menu.component.html";
import css from "./main-menu.component.css";
import { SubComponent } from "../../subcomponent";
import { MainComponent } from "../main.component";

export class MainMenuComponent extends SubComponent {
    constructor(main: MainComponent) {
        super(main, main, html, css);
    }
}
