import html from "./database-importer.component.html";
import css from "./database-importer.component.css";
import { PageComponet } from "../../EzComponent_subclasses";
import { MainComponent } from "../main.component";
import { Click } from "@gsilber/webez";
import { Database } from "../../database";

declare const window: Window;

export class DatabaseImporterComponent extends PageComponet {
    private value = "";

    constructor(main: MainComponent) {
        super(main, html, css);
    }

    @Click("import")
    import(): void {
        const database = new Database(
            window.localStorage.getItem("file-text") ?? "",
            this.main,
        );
        this.main.mergeDatabase(database);
        window.localStorage.removeItem("file-text");
    }

    onActivate(): void {
        return;
    }
}
