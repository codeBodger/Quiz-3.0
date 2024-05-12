import html from "./main-menu.component.html";
import css from "./main-menu.component.css";
import { PageComponet } from "../../EzComponent_subclasses";
import { MainComponent } from "../main.component";
import { Click } from "@gsilber/webez";

export class MainMenuComponent extends PageComponet {
    constructor(main: MainComponent) {
        super(main, html, css);
    }

    @Click("import-set")
    importSet(): void {
        this.main.toSetImporter();
    }

    @Click("practice-set")
    practiceSet(): void {
        this.main.toSetList("Practice");
    }

    @Click("import-all")
    importAll(): void {
        this.main.importAll();
    }

    @Click("set-cards")
    setCards(): void {
        this.main.toSetList("Flashcards");
    }

    onExit(): void {
        return;
    }
}
