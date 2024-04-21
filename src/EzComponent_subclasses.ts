import { EzComponent } from "@gsilber/webez";
import { MainComponent } from "./app/main.component";

export class SubComponent extends EzComponent {
    constructor(
        protected parent: SubComponent | MainComponent,
        protected main: MainComponent,
        html: string,
        css: string,
    ) {
        super(html, css);
    }
}

export class PageComponet extends EzComponent {
    constructor(
        protected main: MainComponent,
        html: string,
        css: string,
    ) {
        super(html, css);
    }
}
