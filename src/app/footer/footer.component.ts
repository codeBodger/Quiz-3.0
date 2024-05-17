import { Click } from "@gsilber/webez";
import html from "./footer.component.html";
import css from "./footer.component.css";
import { MainComponent } from "../main.component";
import { SubComponent } from "../../EzComponent_subclasses";

/**
 * @description The component for the footer at the bottom of the site that persists on all pages
 * @class FooterComponent
 * @extends {SubComponent}
 */
export class FooterComponent extends SubComponent {
    /**
     * @description Creates an instance of FooterComponent
     * @param {MainComponent} parent The main component this is attached to, for additional handling
     * @memberof FooterComponent
     * @constructor
     */
    constructor(parent: MainComponent) {
        super(parent, html, css);
    }

    /**
     * @description Called when the user presses "Save and Exit"
     * @returns {void}
     * @memberof FooterComponent
     * @summary Calls `.exit()` on the main component of the site, allowing the active page component
     * to do anything it needs to and saving the database (in case it wasn't anyway).
     */
    @Click("exit")
    private exit(): void {
        this.main.exit();
    }
}
