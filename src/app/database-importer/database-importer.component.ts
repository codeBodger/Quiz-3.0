import html from "./database-importer.component.html";
import css from "./database-importer.component.css";
import { PageComponet } from "../../EzComponent_subclasses";
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
 * @extends {PageComponet}
 */
export class DatabaseImporterComponent extends PageComponet {
    /**
     * @description Creates an instance of DatabaseImporterComponent
     * @param {MainComponent} main The main component this is attached to, for additional handling
     * @memberof DatabaseImporterComponent
     * @constructor
     */
    constructor(main: MainComponent) {
        super(main, html, css);
    }

    /**
     * @description Actually handles the importing, relies on some stuff in index.html
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

    onExit(): void {
        return;
    }
}
