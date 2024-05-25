import { Click } from "@gsilber/webez";
import html from "./footer.component.html";
import css from "./footer.component.css";
import { MainComponent } from "../main.component";
import { SubComponent } from "../../EzComponent_subclasses";
import {
    BindVisibleToBooleanSRA,
    ClickSRA,
    MouseEventSRA,
} from "../../decoratorsSRA";

/**
 * @description The component for the footer at the bottom of the site that persists on all pages
 * @class FooterComponent
 * @extends {SubComponent}
 * @prop {boolean} signedIn Whether or not the user is signed in, dictates how the signin/out button is displayed
 */
export class FooterComponent extends SubComponent {
    /**
     * @description Whether or not the user is signed in, dictates how the signin/out button is displayed
     * @type {boolean}
     * @memberof FooterComponent
     */
    @BindVisibleToBooleanSRA("logout", (v: boolean) => v)
    @BindVisibleToBooleanSRA("login", (v: boolean) => !v)
    public signedIn: boolean = false;

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
     * @private
     * @summary Calls `.exit()` on the main component of the site, allowing the active page component
     * to do anything it needs to and saving the database (in case it wasn't anyway).
     */
    @Click("exit")
    private exit(): void {
        this.main.exit();
    }

    /**
     * @description Called when the user presses "Login" or "... Logout"
     * @param {MouseEventSRA} e The event created when the button is pressed, includes the id of the decorator
     * @returns {void}
     * @memberof FooterComponent
     */
    @ClickSRA("login")
    @ClickSRA("logout")
    toggleLogin(e: MouseEventSRA): void {
        this.signedIn = !this.signedIn;
        this.exit();
    }
}
