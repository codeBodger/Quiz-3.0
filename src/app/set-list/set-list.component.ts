import html from "./set-list.component.html";
import css from "./set-list.component.css";
import { PageComponet } from "../../EzComponent_subclasses";
import { MainComponent } from "../main.component";
import { SetActivities } from "../../database";
import { BindValue } from "@gsilber/webez";

export class SetListComponent extends PageComponet {
    @BindValue("activity")
    private activity: SetActivities | "" = "";

    constructor(main: MainComponent) {
        super(main, html, css);
    }

    for(activity: SetActivities): void {
        this.activity = activity;
    }
}
