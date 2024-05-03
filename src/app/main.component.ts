import html from "./main.component.html";
import css from "./main.component.css";
import { BindValue, EzComponent } from "@gsilber/webez";
import { FooterComponent } from "./footer/footer.component";
import { MainMenuComponent } from "./main-menu/main-menu.component";
import { PageComponet } from "../EzComponent_subclasses";
import { Database, Set, SetActivities } from "../database";
import { SetImporterComponent } from "./set-importer/set-importer.component";
import { SetListComponent } from "./set-list/set-list.component";
import { QuestionComponent } from "./question/question.component";
import { DatabaseImporterComponent } from "./database-importer/database-importer.component";

/**
 * @description MainComponent is the main component of the app
 * @extends EzComponent
 *
 */
export class MainComponent extends EzComponent {
    private database: Database;

    private footer: FooterComponent = new FooterComponent(this);
    private mainMenu: MainMenuComponent = new MainMenuComponent(this);
    private setImporter: SetImporterComponent = new SetImporterComponent(this);
    private setList: SetListComponent = new SetListComponent(this);
    private allImporter: DatabaseImporterComponent =
        new DatabaseImporterComponent(this);

    @BindValue("page")
    private blank: string = "";

    constructor() {
        super(html, css);
        this.addComponent(this.footer, "footer");
        this.activate(this.mainMenu);
        this.database = Database.loadDatabase(this);
        this.saveDatabase();
    }

    exit() {
        this.activate(this.mainMenu);
        console.log(this.database);
    }

    toSetImporter(): void {
        this.activate(this.setImporter);
    }

    toSetList(activity: SetActivities): void {
        this.setList.for(activity);
        this.activate(this.setList);
    }

    importAll(): void {
        this.activate(this.allImporter);
    }

    askFrom(sets: Set[]): void {
        const set = sets[Math.floor(Math.random() * sets.length)];
        this.activate(new QuestionComponent(set.chooseTerm(), set, sets, this));
    }

    private activate(page: PageComponet) {
        this.freePage();
        page.onActivate();
        this.addComponent(page, "page");
    }

    protected freePage(): void {
        this.blank = "";
    }

    importSet(setData: string): void {
        this.database.addOrUpdateSet(setData, this);
    }

    getSets(): Set[] {
        return this.database.getSets();
    }

    saveDatabase(): void {
        try {
            this.database.save();
        } catch {
            //nothing to do here
        }
    }

    mergeDatabase(database: Database): void {
        this.database.merge(database, this);
    }
}
