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

    // @Input("file")
    // browse(e: any): void {
    //     // console.log(e);
    //     let input = e.originalTarget;

    //     let files = input.files;
    //     if (files.length == 0) return;
    //     const file = files[0];
    //     // console.log(file);
    //     let reader = new FileReader();

    //     reader.onload = (e) => {
    //         const file = e.target?.result;

    //         // This is a regular expression to identify carriage
    //         // Returns and line breaks
    //         if (file instanceof ArrayBuffer) {
    //             return;
    //         }
    //         console.log(file);
    //         const lines = file?.split(/\r\n|\n/);
    //         this.value = lines?.join("\n") ?? "";
    //     };

    //     reader.readAsText(file);
    // }

    // @Change("file-text")
    // upload(e: ValueEvent): void {
    //     this.value = e.value;
    //     console.log(this.value);
    // }

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
