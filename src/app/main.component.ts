import html from "./main.component.html";
import css from "./main.component.css";
import { EzComponent } from "@gsilber/webez";
import { FooterComponent } from "./footer/footer.component";
import { MainMenuComponent } from "./main-menu/main-menu.component";
import { PageComponet } from "../EzComponent_subclasses";
import {
    Database,
    Group,
    Set,
    SetActivities,
    TermSet,
    randomSetAndTerm,
} from "../database";
import { ImporterComponent } from "./importer/importer.component";
import { SetListComponent } from "./set-list/set-list.component";
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
    // private mainMenu: MainMenuComponent = new MainMenuComponent(this);
    // private setImporter: SetImporterComponent = new SetImporterComponent(this);
    // private setList: SetListComponent = new SetListComponent(this);
    // private allImporter: DatabaseImporterComponent =
    //     new DatabaseImporterComponent(this);

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

    toSetList(activity: SetActivities): void {
        const setList = new SetListComponent(activity, this);
        this.activate(setList);
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
        this.activate(
            new QuestionComponent(
                ...randomSetAndTerm(sets, onlyNew),
                sets,
                this,
            ),
        );
    }

    toFlashcards(sets: Set[]): void {
        this.activate(new StartFlashcardsComponent(sets, this));
    }
    doFlashcards(termSets: TermSet[]): void {
        this.activate(new FlashcardsComponent(termSets, this));
    }

    masteredSet(set: Set, sets: Set[]): void {
        this.activate(new SetMasteredComponent(set.name, sets, this));
    }

    private activate(page: PageComponet) {
        this.removeComponent(this.page);
        this.page = page;
        this.addComponent(this.page, "page");
    }

    import(data: string, which: "set" | "group"): void {
        if (which === "group") this.database.addOrUpdateGroup(data);
        else this.database.addOrUpdateSet(data);
        this.database.showAndResetErrors(this);
        this.saveDatabase();
    }

    getSets(): Set[] {
        return this.database.getSets();
    }

    saveDatabase(): void {
        try {
            this.database.save();
        } catch {
            // I have no recolection of what could go wrong here, but let's warn the user
            throw new EzError("Failed to save the database!");
        }
    }

    mergeDatabase(database: Database): void {
        this.database.merge(database, this);
    }
}
