import html from "./set-mastered.component.html";
import css from "./set-mastered.component.css";
import { PageComponent } from "../../EzComponent_subclasses";
import { MainComponent } from "../main.component";
import { BindValue, Click } from "@gsilber/webez";
import { Set } from "../../database";

/**
 * @description A class for displaying that the user has mastered a set
 * @class SetMasteredComponent
 * @extends PageComponent
 */
export class SetMasteredComponent extends PageComponent {
    /**
     * @description The name of the set that was mastered
     * @type {string}
     * @memberof SetMasteredComponent
     * @private
     */
    @BindValue("name")
    private name: string = "";

    /**
     * @description Creates an instance of SetMasteredComponent
     * @param {string} name The name of the set
     * @param {Set[]} sets The sets being practiced, so we can move on to the next term, should the choose to `continue()`
     * @param {MainComponent} parent The main component of the app, for additonal handling
     * @memberof SetMasteredComponent
     * @constructor
     */
    constructor(
        name: string,
        private sets: Set[],
        parent: MainComponent,
    ) {
        super(parent, html, css);
        this.name = name;
    }

    /**
     * @description The method called if the user clicks "Continue"; resumes studying
     * @returns {void}
     * @memberof SetMasteredComponent
     */
    @Click("continue")
    continue(): void {
        this.main.askFrom(this.sets);
    }
}
