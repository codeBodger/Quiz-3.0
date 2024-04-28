import html from "./set-importer.component.html";
import css from "./set-importer.component.css";
import { PageComponet } from "../../EzComponent_subclasses";
import { MainComponent } from "../main.component";

export class SetImporterComponent extends PageComponet {
    constructor(main: MainComponent) {
        super(main, html, css);
    }
}
