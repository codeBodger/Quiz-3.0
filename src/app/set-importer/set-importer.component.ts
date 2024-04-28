import html from "./set-importer.component.html";
import css from "./set-importer.component.css";
import { PageComponet } from "../../EzComponent_subclasses";
import { MainComponent } from "../main.component";
import { BindValue, Click } from "@gsilber/webez";

export class SetImporterComponent extends PageComponet {
    @BindValue("set-data")
    private setData: string = `Set Name
Answer 1\tPrompt 1
Answer 2\tPrompt 2
Answer 3\tPrompt 3
Answer 4\tPrompt 4
Answer 5\tPrompt 5
`;

    constructor(main: MainComponent) {
        super(main, html, css);
    }

    @Click("import")
    import(): void {
        this.main.importSet(this.setData);
    }
}
