import html from "./list.component.html";
import css from "./list.component.css";
import { PageComponent } from "../../EzComponent_subclasses";
import { MainComponent } from "../main.component";
import { Constructor, Group, Set, Activities } from "../../database";
import { BindValue, EzDialog } from "@gsilber/webez";
import { ListButtonComponent } from "../list-button/list-button.component";

/**
 * @description A class representing a list of buttons of sets or groups for a specific `Activity`
 * @class ListComponent
 * @extends {PageComponent}
 */
export class ListComponent<X extends Set | Group> extends PageComponent {
    /**
     * @description The `Activity` that this list of buttons is for, shown as a header
     * @memberof ListComponent
     * @type {Activities}
     * @private
     */
    @BindValue("activity")
    private activity: Activities;

    /**
     * @description The list of buttons
     * @memberof ListComponent
     * @type {ListButtonComponent<X>}
     * @private
     */
    private buttons: ListButtonComponent<X>[] = [];

    /**
     * @description Creates an instance of ListComponent
     * @param {Activities} activity The activity the user's doing (e.g. Practice, Delete, etc.)
     * @param {Constructor<X>} x The constructor for either `Set` or `Group`
     * @param {MainComponent} parent The main component this is attached to, for additional handling
     * @memberof ListComponent
     * @constructor
     */
    constructor(
        activity: Activities,
        x: Constructor<X>,
        parent: MainComponent,
    ) {
        super(parent, html, css);
        this.activity = activity;

        this.buttons.forEach((setButton: ListButtonComponent<X>) => {
            this.removeComponent(setButton);
        });
        this.buttons = [];

        this.main.getData(x).forEach((data: X) => {
            this.buttons.push(new ListButtonComponent(data, this));
        });
        this.buttons.forEach((button: ListButtonComponent<X>) => {
            this.addComponent(button, "items");
        });
    }

    /**
     * @description Do the necessary action based on `activity` and `X`, called from `ListButtonComponent.act()`
     * @param {X} data The `Set` or `Group` chosen
     * @returns {true} Literally just so the type checker yells at me if I'm missing a case
     * @memberof ListComponent
     */
    act(data: X): true {
        const [type, toAskFrom]: ["Set" | "Group", Set[]] =
            data instanceof Set ? ["Set", [data]] : ["Group", data.sets];
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
}
