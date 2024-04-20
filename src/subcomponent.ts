import { EzComponent } from "@gsilber/webez";
import { MainComponent } from "./app/main.component";

export class SubComponent extends EzComponent {
    constructor(
        protected parent: SubComponent | MainComponent,
        protected main: MainComponent,
        html: any,
        css: any,
    ) {
        super(html, css);
    }
}
