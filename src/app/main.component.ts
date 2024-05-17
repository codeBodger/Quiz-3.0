import html from "./main.component.html";
import css from "./main.component.css";
import {
    BindCSSClassToBoolean,
    BindValue,
    EzComponent,
    EzDialog,
} from "@gsilber/webez";
import { FooterComponent } from "./footer/footer.component";
import { MainMenuComponent } from "./main-menu/main-menu.component";
import { PageComponet } from "../EzComponent_subclasses";
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
 * @description MainComponent is the main component of the app
 * @extends EzComponent
 *
 */
export class MainComponent extends EzComponent {
    private database: Database;

    private footer: FooterComponent = new FooterComponent(this);

    private page: PageComponet = new MainMenuComponent(this);

    @BindValue("page")
    private blank: string = "";

    @BindCSSClassToBoolean("page", "egg")
    private egg: boolean = false;

    public get main(): MainComponent {
        return this;
    }

    constructor() {
        super(html, css);
        this.addComponent(this.footer, "footer");
        // this.activate(this.mainMenu);
        this.database = Database.loadDatabase(this);
        this.exit();
        // this.saveDatabase();
        checkImplementation();
    }

    exit() {
        this.page.onExit();
        this.cancel();
        this.saveDatabase();
    }

    cancel() {
        this.activate(new MainMenuComponent(this));
    }

    toSetImporter(): void {
        this.activate(new ImporterComponent(Set, this));
    }

    toGroupImporter(): void {
        this.activate(new ImporterComponent(Group, this));
    }

    toList<X extends Set | Group>(
        activity: Activities,
        x: Constructor<X>,
    ): void {
        this.activate(new ListComponent(activity, x, this));
    }

    importAll(): void {
        this.activate(new DatabaseImporterComponent(this));
    }

    askFrom(sets: Set[], onlyNew: boolean = false): void {
        // const categorised = Set.categorise(sets);
        // const set = onlyNew ? categorised.doing : Set.randomSet(categorised);
        // const term = set?.chooseTerm(onlyNew);
        // if (!set || !term)
        //     throw new EzError("There are insufficient terms in your set(s).");
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

    toFlashcards(sets: Set[]): void {
        this.activate(new StartFlashcardsComponent(sets, this));
    }
    doFlashcards(termSets: TermSet[]): void {
        this.activate(new FlashcardsComponent(termSets, this));
    }

    delete(item: Set | Group): void {
        this.database.delete(item);
    }

    masteredSet(set: Set, sets: Set[]): void {
        this.activate(new SetMasteredComponent(set.name, sets, this));
    }

    private activate(page: PageComponet) {
        this.freePage();
        this.page = page;
        this.addComponent(this.page, "page");
    }

    protected freePage(): void {
        this.removeComponent(this.page);
        this.blank = "";
    }

    import(data: string, which: "set" | "group"): void {
        if (which === "group") this.database.addOrUpdateGroup(data);
        else this.database.addOrUpdateSet(data);
        this.database.showAndResetErrors(this);
        this.saveDatabase();
    }

    getData<X extends Set | Group>(x: Constructor<X>): X[] {
        return (
            new x("") instanceof Group ?
                this.database.groups
            :   this.database.sets) as X[];
    }

    saveDatabase(): void {
        try {
            this.database.save();
            this.egg = this.database
                .toString()
                .toLowerCase()
                .includes("samhain");
        } catch {
            // I have no recolection of what could go wrong here, but let's warn the user
            throw new EzError("Failed to save the database!");
        }
    }

    mergeDatabase(database: Database): void {
        this.database.merge(database, this);
    }
}
