import html from "./list.component.html";
import css from "./list.component.css";
import { PageComponet } from "../../EzComponent_subclasses";
import { MainComponent } from "../main.component";
import { Constructor, Group, Set, Activities } from "../../database";
import { BindValue, EzDialog } from "@gsilber/webez";
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
        this.buttons.forEach((button: ListButtonComponent<X>) => {
            this.addComponent(button, "items");
        });
    }

    act(data: X): true {
        const [type, toAskFrom]: ["Set" | "Group", Set[]] =
            data instanceof Set ? ["Set", [data]] : ["Group", data.sets];
        // const toAskFrom = data instanceof Set ? [data] : data.sets;
        // const toAskFrom = data instanceof Group ? data.sets : [data];
        switch (this.activity) {
            case "Practice":
                this.main.askFrom(toAskFrom);
                return true;
            case "Flashcards":
                this.main.toFlashcards(toAskFrom);
                return true;
            case "Delete":
                EzDialog.popup(
                    this,
                    `Are you sure you want to delete the ${type} "${data.name}"?` +
                        "<h2>THIS CAN NOT BE UNDONE</h2>" +
                        (type === "Set" ?
                            "This will delete the terms within the set as well."
                        :   "The sets within the group will not be deleted."),
                    `Delete ${type}`,
                    ["Delete", "Cancel"],
                ).subscribe((v: string) => {
                    switch (v) {
                        case "Delete":
                            this.main.delete(data);
                            this.main.exit();
                            return;
                        case "Cancel":
                            return;
                        default:
                            this.act(data);
                    }
                });
                return true;
        }
    }

    onExit(): void {
        return;
    }
}
