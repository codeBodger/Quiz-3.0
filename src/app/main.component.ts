import html from "./main.component.html";
import css from "./main.component.css";
import { EzComponent } from "@gsilber/webez";
import { FooterComponent } from "./footer/footer.component";
import { MainMenuComponent } from "./main-menu/main-menu.component";

/**
 * @description MainComponent is the main component of the app
 * @extends EzComponent
 *
 */
export class MainComponent extends EzComponent {
    private footer: FooterComponent = new FooterComponent(this);
    private mainMenu: MainMenuComponent = new MainMenuComponent(this);

    constructor() {
        super(html, css);
        this.addComponent(this.footer, "footer");
        this.exit();
    }

    exit() {
        this.addComponent(this.mainMenu, "page");
    }
}
