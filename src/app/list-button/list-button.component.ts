import html from "./list-button.component.html";
import css from "./list-button.component.css";
import { SubComponent } from "../../EzComponent_subclasses";
import { ListComponent } from "../list/list.component";
import { BindValue, Click } from "@gsilber/webez";
import { Group, Set } from "../../database";

/**
 * @description A class representing an element of a list of buttons of sets or groups
 * @class ListButtonComponent
 * @extends {SubComponent}
 */
export class ListButtonComponent<X extends Set | Group> extends SubComponent {
    /**
     * @description The name of the set or group to be displayed on the button
     * @memberof ListButtonComponent
     * @type {string}
     * @private
     */
    @BindValue("act")
    private readonly name: string;

    /**
     * @description Creates an instance of ListButtonComponent
     * @param {X} x The Set or Group associated with this button
     * @param {ListComponent<X>} parent The list component this is a part of
     * @memberof ListButtonComponent
     * @constructor
     */
    constructor(
        readonly x: X,
        protected parent: ListComponent<X>,
    ) {
        super(parent, html, css);
        this.name = x.name;
    }

    /**
     * @description Does the necessary stuff for when the button is clicked; dependant on what the list is actually for
     * @memberof ListButtonComponent
     * @returns {void}
     */
    @Click("act")
    act(): void {
        this.parent.act(this.x);
    }
}
