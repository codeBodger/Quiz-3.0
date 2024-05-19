import html from "./main.component.html";
import css from "./main.component.css";
import {
    BindCSSClassToBoolean,
    BindStyle,
    BindValue,
    EzComponent,
    EzDialog,
} from "@gsilber/webez";
import { FooterComponent } from "./footer/footer.component";
import { MainMenuComponent } from "./main-menu/main-menu.component";
import { PageComponent } from "../EzComponent_subclasses";
import {
    Constructor,
    Database,
    Group,
    Set,
    Activities,
    TermSet,
    randomSetAndTerm,
} from "../database";
import { ImporterComponent } from "./importer/importer.component";
import { ListComponent } from "./list/list.component";
import { QuestionComponent } from "./question/question.component";
import { DatabaseImporterComponent } from "./database-importer/database-importer.component";
import { SetMasteredComponent } from "./set-mastered/set-mastered.component";
import { checkImplementation } from "../question_types";
import { FlashcardsComponent } from "./flashcards/flashcards.component";
import { StartFlashcardsComponent } from "./start-flashcards/start-flashcards.component";
import { EzError } from "./EzError/EzError.component";

/**
 * @description MainComponent is the main component of the site
 * @class MainComponent
 * @extends EzComponent
 * @property {MainComponent} main Actually just a getter that returns `this`; necessary for use with EzComponentSRA
 */
export class MainComponent extends EzComponent {
    /**
     * @description The database of the user
     * @type {Database}
     * @memberof MainComponent
     * @private
     */
    private database: Database;

    /**
     * @description The component for the footer displayed at the bottom of every page
     * @type {FooterComponent}
     * @memberof MainComponent
     * @private
     */
    private footer: FooterComponent = new FooterComponent(this);

    /**
     * @description The component storing whatever page is currently being displayed; defaulted to the main menu on startup
     * @type {PageComponent}
     * @memberof MainComponent
     * @private
     */
    private page: PageComponent = new MainMenuComponent(this);

    /**
     * @description An empty string that's just here to make sure that the part of the DOM with the page gets cleared completely
     * @type {string}
     * @memberof MainComponent
     * @private
     */
    @BindValue("page")
    private blank: string = "";

    /**
     * If you figure out what this does, you'll have learned something about me; something I only learned myself quite recently.
     */
    @BindCSSClassToBoolean("page", "egg")
    private egg: boolean = false;

    /**
     * @description Just a getter that returns `this`; necessary for use with EzComponentSRA
     * @type {MainComponent}
     * @memberof MainComponent
     * @public
     */
    public get main(): MainComponent {
        return this;
    }

    /**
     * @description Creates an instance of MainComponent
     * @memberof MainComponent
     * @public
     * @constructor
     */
    constructor() {
        super(html, css);
        this.addComponent(this.footer, "footer");
        this.database = Database.loadDatabase(this);
        this.exit();
        checkImplementation();
    }

    /**
     * @description Exits the current page, returning to the main menu, running that page's `onExit()` and saving the database
     * @returns {void}
     * @memberof MainComponent
     */
    exit(): void {
        this.page.onExit();
        this.cancel();
        this.saveDatabase();
    }

    /**
     * @description Actually does the switching back to the main menu; can be used directly to avoid saving, etc.
     * @returns {void}
     * @memberof MainComponent
     */
    cancel(): void {
        this.activate(new MainMenuComponent(this));
    }

    /**
     * @description Makes and activates the component to import a group or set in the way to import a group
     * @returns {void}
     * @memberof MainComponent
     */
    toGroupImporter(): void {
        this.activate(new ImporterComponent(Group, this));
    }
    /**
     * @description Makes and activates the component to import a group or set in the way to import a set
     * @returns {void}
     * @memberof MainComponent
     */
    toSetImporter(): void {
        this.activate(new ImporterComponent(Set, this));
    }

    /**
     * @description Makes and activates the component to import an entire database
     * @returns {void}
     * @memberof MainComponent
     */
    importAll(): void {
        this.activate(new DatabaseImporterComponent(this));
    }

    /**There is no method for Export All as this is done in `download()` in `index.html` */

    /**
     * @description Makes and activates the component to choose from a list of either the groups or sets for a given activity
     * @param {Activities} activity The activity to be done
     * @param {Constructor<X>} x The constructor of either `Set` or `Group` depending on the kind of list
     * @returns {void}
     * @memberof MainComponent
     */
    toList<X extends Set | Group>(
        activity: Activities,
        x: Constructor<X>,
    ): void {
        this.activate(new ListComponent(activity, x, this));
    }

    /**
     * @description Handles finding a term to test the user on
     * @param {Set[]} sets The sets that the user is studying
     * @param {boolean} onlyNew Whether we need to give the user a new term from the set (because there aren't enough for a given question type)
     * @returns {void}
     * @memberof MainComponent
     * @summary If we've tried to use a question type that there aren't enough started terms for,
     * used to force getting a new term.  If this still fails or there aren't enough letters in the set,
     * give a popup.  If something else went wrong, throw that error!
     */
    askFrom(sets: Set[], onlyNew: boolean = false): void {
        try {
            this.activate(
                new QuestionComponent(
                    ...randomSetAndTerm(sets, onlyNew),
                    sets,
                    this,
                ),
            );
        } catch (e) {
            const message = e instanceof Error ? e.message : "";
            switch (message.split('"')[0]) {
                /**Go try to get a new term */
                case "Oops!  We didn't catch that there weren't enough terms!":
                    this.askFrom(sets, true);
                    return;
                /**Tell the user that there is no new term to get or that their
                 * set has too few chars in it */
                case "There are insufficient terms in your set(s).":
                case "There are insufficient unique characters in the set ":
                    EzDialog.popup(this, message);
                    return;
                default:
                    throw e;
            }
        }
    }

    /**
     * @description Creates and activates a SetMasteredComponent when the user masters a set
     * @param {Set} set The set that was mastered
     * @param {Set[]} sets The sets the user was studying, that we will return to if they choose "Continue"
     * @returns {void}
     * @memberof MainComponent
     */
    masteredSet(set: Set, sets: Set[]): void {
        this.activate(new SetMasteredComponent(set.name, sets, this));
    }

    /**
     * @description Creates and activates the component to let the user choose which terms to include in the flashcards
     * @param {Set[]} sets The sets that the user wants to practice
     * @returns {void}
     * @memberof MainComponent
     */
    toFlashcards(sets: Set[]): void {
        this.activate(new StartFlashcardsComponent(sets, this));
    }
    /**
     * @description Creates and activates the component to actually practice using the fashcards
     * @param {TermSet[]} termSets The terms to practice (as dictated by StartFlashcardsComponent) with their set names
     * @returns {void}
     * @memberof MainComponent
     */
    doFlashcards(termSets: TermSet[]): void {
        this.activate(new FlashcardsComponent(termSets, this));
    }

    /**
     * @description Called when the user confirms that they want to delete a set or group
     * @param {Set | Group} item The set or group they want to delete
     * @returns {void}
     * @memberof MainComponent
     */
    delete(item: Set | Group): void {
        this.database.delete(item);
    }

    /**
     * @description Removes the current page and replaces it with the one provided in the argument
     * @param {PageComponent} page The page to activate
     * @returns {void}
     * @memberof MainComponent
     * @private
     */
    private activate(page: PageComponent): void {
        this.freePage();
        this.page = page;
        this.addComponent(this.page, "page");
    }

    /**
     * @description Both removes the current page component and ensures that the DOM where it goes is empty
     * @returns {void}
     * @memberof MainComponent
     */
    protected freePage(): void {
        this.removeComponent(this.page);
        this.blank = "";
    }

    /**
     * @description Actually handles the importing of a group or set, shows any errors that occured, and saves the updated database
     * @param {string} data The data entered to be imported
     * @param {"set" | "group"} which If it's a set or a group that we're importing
     * @returns {void}
     * @memberof MainComponent
     */
    import(data: string, which: "set" | "group"): void {
        if (which === "group") this.database.addOrUpdateGroup(data);
        else this.database.addOrUpdateSet(data);
        this.database.showAndResetErrors(this);
        this.saveDatabase();
    }

    /**
     * @description Gets the list of all sets or groups in the database for use in creating the list in ListComponent
     * @param {Constructor<X extends Set | Group>} x The contstructor for either a group or a set, so we know which to get
     * @returns {X[]}
     * @memberof MainComponent
     */
    getData<X extends Set | Group>(x: Constructor<X>): X[] {
        return (
            new x("") instanceof Group ?
                this.database.groups
            :   this.database.sets) as X[];
    }

    /**
     * @description Makes the database save itself and handles an error if one occurs
     * @returns {void}
     * @memberof MainComponent
     */
    saveDatabase(): void {
        try {
            this.database.save();
            this.egg = this.database
                .toString()
                .toLowerCase()
                .includes("samhain");
        } catch {
            /**I have no recolection of what could go wrong here, but let's warn the user */
            throw new EzError("Failed to save the database!");
        }
    }

    /**
     * @description Merges an imported database into the existing one using the database's `.merge()` method
     * @param {Database} database The database to merge into `this.database`
     * @returns {void}
     * @memberof MainComponent
     */
    mergeDatabase(database: Database): void {
        this.database.merge(database, this);
    }
}
