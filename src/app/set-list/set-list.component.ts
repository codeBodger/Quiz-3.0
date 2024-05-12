import html from "./set-list.component.html";
import css from "./set-list.component.css";
import { PageComponet } from "../../EzComponent_subclasses";
import { MainComponent } from "../main.component";
import { Set, SetActivities } from "../../database";
import { BindValue } from "@gsilber/webez";
import { ListButtonComponent } from "../list-button/list-button.component";

export class SetListComponent extends PageComponet {
    @BindValue("activity")
    private activity: SetActivities;

    private buttons: ListButtonComponent<Set>[] = [];

    constructor(activity: SetActivities, main: MainComponent) {
        super(main, html, css);
        this.activity = activity;

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

    act(set: Set): true {
        switch (this.activity) {
            case "Practice":
                this.main.askFrom([set]);
                return true;
            case "Flashcards":
                this.main.toFlashcards([set]);
                return true;
        }
    }

    onExit(): void {
        return;
    }
}
