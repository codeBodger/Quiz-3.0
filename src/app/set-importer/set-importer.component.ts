import html from "./set-importer.component.html";
import css from "./set-importer.component.css";
import { PageComponet } from "../../EzComponent_subclasses";
import { MainComponent } from "../main.component";
import { BindValue, Change, Click, ValueEvent } from "@gsilber/webez";

const DEFAULT_DATA = `Set Name
Answer 1\tPrompt 1
Answer 2\tPrompt 2
Answer 3\tPrompt 3
Answer 4\tPrompt 4
Answer 5\tPrompt 5
`;

export class SetImporterComponent extends PageComponet {
    @BindValue("set-data")
    private setData: string = DEFAULT_DATA;

    constructor(main: MainComponent) {
        super(main, html, css);
    }

    @Change("set-data")
    onDataChange(e: ValueEvent) {
        this.setData = e.value;
    }

    @Click("import")
    import(): void {
        this.main.importSet(this.setData);
    }

    @Click("cancel")
    cancel(): void {
        this.main.cancel();
    }

    onActivate(): void {
        // this.setData = DEFAULT_DATA;
    }

    onExit(): void {
        this.import();
    }
}
