import html from "./main-menu.component.html";
import css from "./main-menu.component.css";
import { PageComponet } from "../../EzComponent_subclasses";
import { MainComponent } from "../main.component";
import { Group, Set } from "../../database";
import { ClickSRA, MouseEventSRA } from "../../decoratorsSRA";
import { EzError } from "../EzError/EzError.component";

/**
 * @description A class representing the main menu of the site
 * @class MainMenuComponent
 * @extends {PageComponet}
 */
export class MainMenuComponent extends PageComponet {
    /**
     * @description Creates an instance of MainMenuComponent
     * @param {MainComponent} parent The main component this is attached to, for additional handling
     * @memberof MainMenuComponent
     * @constructor
     */
    constructor(parent: MainComponent) {
        super(parent, html, css);
    }

    /**
     * @description Does the right thing based on the button that's clicked
     * @param {MouseEventSRA} e The event created when the button is pressed, includes the id of the decorator
     * @returns {void}
     * @memberof MainMenuComponent
     */
    @ClickSRA("import-group")
    @ClickSRA("import-set")
    @ClickSRA("import-all")
    @ClickSRA("export-all")
    @ClickSRA("practice-group")
    @ClickSRA("practice-set")
    @ClickSRA("group-cards")
    @ClickSRA("set-cards")
    @ClickSRA("delete-group")
    @ClickSRA("delete-set")
    act(e: MouseEventSRA): void {
        switch (e.idSRA) {
            case "import-group":
                this.main.toGroupImporter();
                break;
            case "import-set":
                this.main.toSetImporter();
                break;

            case "import-all":
                this.main.importAll();
                break;
            case "export-all":
                /**Is really done by `download()` in `index.html` */
                console.log("exporting...");
                break;

            case "practice-group":
                this.main.toList("Practice", Group);
                break;
            case "practice-set":
                this.main.toList("Practice", Set);
                break;

            case "group-cards":
                this.main.toList("Flashcards", Group);
                break;
            case "set-cards":
                this.main.toList("Flashcards", Set);
                break;

            case "delete-group":
                this.main.toList("Delete", Group);
                break;
            case "delete-set":
                this.main.toList("Delete", Set);
                break;

            default:
                throw new EzError(
                    "How did you choose something that doesn't exist???",
                );
        }
    }

    onExit(): void {
        return;
    }
}
