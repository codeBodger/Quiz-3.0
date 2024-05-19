import { EzComponent } from "./EzComponent";
import { ExtendedEventMap } from "@gsilber/webez";
/**
 * @description Decorator to bind the cssClassName property if the boolean property is true
 * @param {string} id the element to bind the property to
 * @param {string} cssClassName the class name(s) to add (space separated)
 * @param {(this: This, value: Value) => boolean} transform Transforms the bound value into a boolean
 * @returns DecoratorCallback
 * @export
 * @group Bind Decorators
 * @example
 * -//This will add the css class myCSSClass to the div with id myDiv if the enabled property is true
 * -@BindCSSClassToBooleanSRA("myDiv", "myCSSClass", (v: string) => v.toLowerCase().startsWith("y"))
 * -public enabled: string = "Yes";
 */
export declare function BindCSSClassToBooleanSRA<
    This extends EzComponent,
    Value,
>(
    id: string,
    cssClassName: string,
    transform: (this: This, value: Value) => boolean,
): (
    target: any,
    context: ClassFieldDecoratorContext<EzComponent, Value>,
) => any;

/**
 * @description Decorator to bind the visibility of an element to a boolean
 * @param {string} id the element to bind the property to
 * @param {(this: This, value: Value) => boolean} transform Transforms the bound value into a boolean
 * @returns DecoratorCallback
 * @export
 * @group Bind Decorators
 * @example
 * -//This will hide the div with id myDiv1 if the visible property is false
 * -@BindVisibleToBooleanSRA("myDiv1", (v: string) => v.toLowerCase().startsWith("y"))
 * -public visible: string = "Yes";
 */
export declare function BindVisibleToBooleanSRA<
    This extends EzComponent,
    Value,
>(
    id: string,
    transform: (this: This, value: Value) => boolean,
): (
    target: undefined,
    context: ClassFieldDecoratorContext<EzComponent, Value>,
) => any;

/**
 * @description Decorator to bind a generic event to an element
 * @param {string} htmlElementID the element to bind the event to
 * @param {K extends keyof HTMLElementEventMap} type the event to bind
 * @returns DecoratorCallback
 * @export
 * @group Event Decorators
 * @example
 * -@GenericEventSRA("myButton", "click")
 * -myButtonClick(e: MouseEventSRA) {
 * -   console.log(`Button "${e.idSRA}" was clicked`);
 * -}
 */
export declare function GenericEventSRA<K extends keyof HTMLElementEventMap>(
    htmlElementID: string,
    type: K,
): <This extends EzComponent>(
    target: (this: This, event: ExtendedEventMap[K]) => void,
    context: ClassMethodDecoratorContext<
        This,
        (this: This, event: ExtendedEventMap[K]) => void
    >,
) => void;

/**
 * @description A class to allow for the use of the id passed to the event decorator with `ClickSRA`
 * @class MouseEventSRA
 * @extends MouseEvent
 * @readonly @prop {string} idSRA The id of the button pressed, i.e. what was passed to `ClickSRA`
 */
export class MouseEventSRA extends MouseEvent {
    /**
     * @description The id of the button pressed, i.e. what was passed to `ClickSRA`
     * @type {string}
     * @memberof MouseEventSRA
     * @readonly
     */
    public readonly idSRA: string;
}

/**
 * @description Decorator to bind a click event to an element
 * @param {string} htmlElementID the element to bind the event to
 * @returns DecoratorCallback
 * @export
 * @group Event Decorators
 * @example
 * -@ClickSRA("myButton")
 * -myButtonClick(e: MouseEventSRA) {
 * -    console.log(`Button "${e.idSRA}" was clicked`);
 * -}
 */
export declare function ClickSRA(
    htmlElementID: string,
): <This_1 extends EzComponent>(
    target: (this: This_1, event: MouseEventSRA) => void,
    context: ClassMethodDecoratorContext<
        This_1,
        (this: This_1, event: MouseEventSRA) => void
    >,
) => void;
