import html from "./main.component.html";
import css from "./main.component.css";
import { BindValue, EzComponent } from "@gsilber/webez";
import { FooterComponent } from "./footer/footer.component";
import { MainMenuComponent } from "./main-menu/main-menu.component";
import { PageComponet } from "../EzComponent_subclasses";

/**
 * @description MainComponent is the main component of the app
 * @extends EzComponent
 *
 */
export class MainComponent extends EzComponent {
    private footer: FooterComponent = new FooterComponent(this);
    private mainMenu: MainMenuComponent = new MainMenuComponent(this);

    @BindValue("page")
    private blank: string = "";

    constructor() {
        super(html, css);
        this.addComponent(this.footer, "footer");
        this.activate(this.mainMenu);
    }

    exit() {
        this.activate(this.mainMenu);
    }

    private activate(page: PageComponet) {
        this.freePage();
        this.addComponent(page, "page");
    }

    protected freePage(): void {
        this.blank = "";
    }
}
