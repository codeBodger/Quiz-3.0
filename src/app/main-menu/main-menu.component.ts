import html from "./main-menu.component.html";
import css from "./main-menu.component.css";
import { PageComponet } from "../../EzComponent_subclasses";
import { MainComponent } from "../main.component";
import { Click } from "@gsilber/webez";
import { Group, Set } from "../../database";

export class MainMenuComponent extends PageComponet {
    constructor(main: MainComponent) {
        super(main, html, css);
    }

    @Click("import-group")
    importGroup(): void {
        this.main.toGroupImporter();
    }

    @Click("import-set")
    importSet(): void {
        this.main.toSetImporter();
    }

    @Click("practice-set")
    practiceSet(): void {
        this.main.toList("Practice", Set);
    }

    @Click("practice-group")
    practiceGroup(): void {
        this.main.toList("Practice", Group);
    }

    @Click("import-all")
    importAll(): void {
        this.main.importAll();
    }

    @Click("set-cards")
    setCards(): void {
        this.main.toList("Flashcards", Set);
    }

    @Click("group-cards")
    groupCards(): void {
        this.main.toList("Flashcards", Group);
    }

    onExit(): void {
        return;
    }
}
