import html from "./set-list.component.html";
import css from "./set-list.component.css";
import { PageComponet } from "../../EzComponent_subclasses";
import { MainComponent } from "../main.component";
import { Set, SetActivities } from "../../database";
import { BindValue } from "@gsilber/webez";
import { ListButtonComponent } from "../list-button/list-button.component";
import { EzError } from "../EzError/EzError.component";

export class SetListComponent extends PageComponet {
    @BindValue("activity")
    private activity: SetActivities | "" = "";

    private buttons: ListButtonComponent<Set>[] = [];

    constructor(main: MainComponent) {
        super(main, html, css);
    }

    for(activity: SetActivities): void {
        this.activity = activity;
    }

    onActivate(): void {
        this.buttons.forEach((setButton: ListButtonComponent<Set>) => {
            this.removeComponent(setButton);
        });
        this.buttons = [];

        this.main.getSets().forEach((set: Set) => {
            this.buttons.push(new ListButtonComponent(set, this, this.main));
        });
        this.buttons.forEach((setButton: ListButtonComponent<Set>) => {
            this.addComponent(setButton, "sets");
        });
    }

    act(set: Set): void {
        switch (this.activity) {
            case "Practice":
                this.main.askFrom([set]);
                break;
            case "Flashcards":
                this.main.toFlashcards([set]);
                break;
            default:
                throw new EzError("Activity specified improperly.");
        }
        this.activity = "";
    }
}
