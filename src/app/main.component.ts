import html from "./main.component.html";
import css from "./main.component.css";
import { BindValue, EzComponent } from "@gsilber/webez";
import { FooterComponent } from "./footer/footer.component";
import { MainMenuComponent } from "./main-menu/main-menu.component";
import { PageComponet } from "../EzComponent_subclasses";
import { Database } from "../database";
import { SetImporterComponent } from "./set-importer/set-importer.component";

/**
 * @description MainComponent is the main component of the app
 * @extends EzComponent
 *
 */
export class MainComponent extends EzComponent {
    private database: Database = new Database("", this);

    private footer: FooterComponent = new FooterComponent(this);
    private mainMenu: MainMenuComponent = new MainMenuComponent(this);
    private setImporter: SetImporterComponent = new SetImporterComponent(this);

    @BindValue("page")
    private blank: string = "";

    constructor() {
        super(html, css);
        this.addComponent(this.footer, "footer");
        this.activate(this.mainMenu);
        // this.database = Database.loadDatabase(this);
    }

    exit() {
        this.activate(this.mainMenu);
        console.log(this.database);
    }

    toSetImporter(): void {
        this.activate(this.setImporter);
    }

    private activate(page: PageComponet) {
        this.freePage();
        this.addComponent(page, "page");
    }

    protected freePage(): void {
        this.blank = "";
    }

    importSet(setData: string): void {
        this.database.addOrUpdateSet(setData, this);
    }
}
