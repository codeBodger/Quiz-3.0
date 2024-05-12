import html from "./set-list.component.html";
import css from "./set-list.component.css";
import { PageComponet } from "../../EzComponent_subclasses";
import { MainComponent } from "../main.component";
import { Constructor, Group, Set, Activities } from "../../database";
import { BindValue } from "@gsilber/webez";
import { ListButtonComponent } from "../list-button/list-button.component";

export class ListComponent<X extends Set | Group> extends PageComponet {
    @BindValue("activity")
    private activity: Activities;

    private buttons: ListButtonComponent<X>[] = [];

    constructor(activity: Activities, x: Constructor<X>, main: MainComponent) {
        super(main, html, css);
        this.activity = activity;

        this.buttons.forEach((setButton: ListButtonComponent<X>) => {
            this.removeComponent(setButton);
        });
        this.buttons = [];

        this.main.getData(x).forEach((data: X) => {
            this.buttons.push(new ListButtonComponent(data, this, this.main));
        });
        this.buttons.forEach((setButton: ListButtonComponent<X>) => {
            this.addComponent(setButton, "sets");
        });
    }

    act(data: X): true {
        const toAskFrom = data instanceof Set ? [data] : data.sets;
        // const toAskFrom = data instanceof Group ? data.sets : [data];
        switch (this.activity) {
            case "Practice":
                this.main.askFrom(toAskFrom);
                return true;
            case "Flashcards":
                this.main.toFlashcards(toAskFrom);
                return true;
        }
    }

    onExit(): void {
        return;
    }
}
