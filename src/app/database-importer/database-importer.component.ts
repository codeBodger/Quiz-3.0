import html from "./database-importer.component.html";
import css from "./database-importer.component.css";
import { PageComponent } from "../../EzComponent_subclasses";
import { MainComponent } from "../main.component";
import { Click } from "@gsilber/webez";
import { Database } from "../../database";

/**
 * @description The JS window, used to get access to localStorage
 */
declare const window: Window;

/**
 * @description The component for handling importing a database from the user's disk
 * @class DatabaseImporterComponent
 * @extends {PageComponent}
 */
export class DatabaseImporterComponent extends PageComponent {
    /**
     * @description Creates an instance of DatabaseImporterComponent
     * @param {MainComponent} parent The main component this is attached to, for additional handling
     * @memberof DatabaseImporterComponent
     * @constructor
     */
    constructor(parent: MainComponent) {
        super(parent, html, css);
    }

    /**
     * @description Actually handles the importing, relies on `upload()` in index.html being run `onchange`
     * @returns {void}
     * @memberof DatabaseImporterComponent
     */
    @Click("import")
    import(): void {
        const database = new Database(
            window.localStorage.getItem("file-text") ?? "",
            this.main,
        );
        this.main.mergeDatabase(database);
        window.localStorage.removeItem("file-text");
    }
}
