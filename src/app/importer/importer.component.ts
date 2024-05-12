import html from "./importer.component.html";
import css from "./importer.component.css";
import { PageComponet } from "../../EzComponent_subclasses";
import { MainComponent } from "../main.component";
import { BindValue, Change, Click, EzDialog, ValueEvent } from "@gsilber/webez";
import { Set, Group, Constructor } from "../../database";

const SET_DEFAULT_DATA = `Set Name
Answer 1\tPrompt 1
Answer 2\tPrompt 2
Answer 3\tPrompt 3
Answer 4\tPrompt 4
Answer 5\tPrompt 5
`;
const GROUP_DEFAULT_DATA = `Group Name
Set 1
Set 2
Set 3
Set 4
`;

export class ImporterComponent<X extends Set | Group> extends PageComponet {
    @BindValue("data")
    private data: string = SET_DEFAULT_DATA;

    @BindValue("type")
    private type: "set" | "group" = "set";

    constructor(x: Constructor<X>, main: MainComponent) {
        super(main, html, css);
        if (new x("") instanceof Group) {
            this.data = GROUP_DEFAULT_DATA;
            this.type = "group";
        }
    }

    @Change("data")
    onDataChange(e: ValueEvent) {
        this.data = e.value;
    }

    @Click("import")
    import(event?: MouseEvent): void {
        this.main.import(this.data, this.type);
        if (event instanceof MouseEvent) EzDialog.popup(this, "Imported!");
    }

    @Click("cancel")
    cancel(): void {
        this.main.cancel();
    }

    onExit(): void {
        this.import();
    }
}
