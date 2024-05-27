import { Click, EzDialog } from "@gsilber/webez";
import html from "./footer.component.html";
import css from "./footer.component.css";
import { MainComponent } from "../main.component";
import { SubComponent } from "../../EzComponent_subclasses";
import {
    BindVisibleToBooleanSRA,
    ClickSRA,
    MouseEventSRA,
} from "../../decoratorsSRA";
import { EzError } from "../EzError/EzError.component";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../../config";

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
     * @returns {Promise<void>}
     * @memberof FooterComponent
     */
    @ClickSRA("login")
    @ClickSRA("logout")
    async toggleLogin(e: MouseEventSRA): Promise<void> {
        switch (e.idSRA) {
            case "login":
                await signInWithPopup(auth, provider)
                    .then(() => {
                        this.exit();
                    })
                    .catch((error: Error) => {
                        EzDialog.popup(
                            this.main,
                            `Login Failed!<br>${error.name}: ${error.message}`,
                        );
                    });
                break;
            case "logout":
                await signOut(auth)
                    .then(() => {
                        this.signedIn = false;
                    })
                    .catch((error: Error) => {
                        EzDialog.popup(
                            this.main,
                            `Logout Failed!<br>${error.name}: ${error.message}`,
                        );
                    });
                break;
            default:
                throw new EzError(
                    "How did you run this with a different button click?",
                );
        }
    }
}
