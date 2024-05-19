import html from "./importer.component.html";
import css from "./importer.component.css";
import { PageComponent } from "../../EzComponent_subclasses";
import { MainComponent } from "../main.component";
import { BindValue, Change, Click, EzDialog, ValueEvent } from "@gsilber/webez";
import { Set, Group, Constructor } from "../../database";

/**
 * @description The example/default data to show the user if they're importing a set
 * @type {string}
 * @constant
 */
const SET_DEFAULT_DATA: string = `Set Name
Answer 1\tPrompt 1
Answer 2\tPrompt 2
Answer 3\tPrompt 3
Answer 4\tPrompt 4
Answer 5\tPrompt 5
`;

/**
 * @description The example/default data to show the user if they're importing a group
 * @type {string}
 * @constant
 */
const GROUP_DEFAULT_DATA: string = `Group Name
Set 1
Set 2
Set 3
Set 4
`;

/**
 * @description A class for handling importing a single set or group
 * @class ImporterComponent
 * @extends {PageComponent}
 * @param {extends Set | Group} X The type we're importing, either Set or Group
 */
export class ImporterComponent<X extends Set | Group> extends PageComponent {
    /**
     * @description The data in the textarea that the user will enter
     * @memberof ImporterComponent
     * @type {string}
     * @private
     */
    @BindValue("data")
    private data: string = SET_DEFAULT_DATA;

    /**
     * @description Label for if we're importing a group or a set
     * @memberof ImporterComponent
     * @type {"set" | "group"}
     * @private
     */
    @BindValue("type")
    private type: "set" | "group" = "set";

    /**
     * @description Creates an instance of ImporterComponent
     * @param {Constructor<X>} x The constructor for either a Set or Group (based on `X`)
     * @param {MainComponent} parent The main component this is attached to, for additional handling
     * @memberof ImporterComponent
     * @constructor
     */
    constructor(x: Constructor<X>, parent: MainComponent) {
        super(parent, html, css);
        if (new x("") instanceof Group) {
            this.data = GROUP_DEFAULT_DATA;
            this.type = "group";
        }
    }

    /**
     * @description Updates the value of `.data` when the user changes the text in the textarea
     * @param {ValueEvent} e The event created when the change occurs, `e.value` is the new text
     * @memberof ImporterComponent
     * @returns {void}
     */
    @Change("data")
    onDataChange(e: ValueEvent): void {
        this.data = e.value;
    }

    /**
     * @description Called when the user clicks "Import" by `onExit`, actually imports the data into the database
     * @param {MouseEvent | undefined} event Created by the Click event; if we're not exiting, show a popup that the import happened
     * @memberof ImporterComponent
     * @returns {void}
     */
    @Click("import")
    import(event?: MouseEvent): void {
        this.main.import(this.data, this.type);
        if (event instanceof MouseEvent) EzDialog.popup(this, "Imported!");
    }

    /**
     * @description Called if the user doesn't want to import anything, simply retruns to the main menu without doing anything
     * @returns {void}
     * @memberof ImporterComponent
     */
    @Click("cancel")
    cancel(): void {
        this.main.cancel();
    }

    /**
     * @description Called by the main component when the user exits; imports the data, even if "Import" isn't clicked
     * @returns {void}
     * @memberof ImporterComponent
     */
    onExit(): void {
        this.import();
    }
}
