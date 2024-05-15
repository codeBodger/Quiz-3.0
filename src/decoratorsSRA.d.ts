import { EzComponent } from "./EzComponent";
import { ExtendedEventMap } from "@gsilber/webez";
/**
 * @description Decorator to bind the cssClassName property if the boolean property is true
 * @param id the element to bind the property to
 * @param cssClassName the class name to add
 * @returns DecoratorCallback
 * @export
 * @group Bind Decorators
 * @example
 * //This will add the css class myCSSClass to the div with id myDiv if the enabled property is true
 * @BindCSSClassToBoolean("myDiv", "myCSSClass")
 * public enabled: boolean = true;
 */
// export declare function BindCSSClassToBooleanSRA<
//     This extends EzComponent,
//     Value extends boolean,
// >(
//     id: string,
//     cssClassName: string,
//     transform?: (this: This, value: Value) => boolean,
// ): (
//     target: any,
//     context: ClassFieldDecoratorContext<EzComponent, Value>,
// ) => any;

/**
 * @description Decorator to bind the cssClassName property if the boolean property is true
 * @param id the element to bind the property to
 * @param cssClassName the class name to add
 * @returns DecoratorCallback
 * @export
 * @group Bind Decorators
 * @example
 * //This will add the css class myCSSClass to the div with id myDiv if the enabled property is true
 * @BindCSSClassToBoolean("myDiv", "myCSSClass")
 * public enabled: boolean = true;
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
 * @param id the element to bind the property to
 * @returns DecoratorCallback
 * @export
 * @group Bind Decorators
 * @example
 * //This will hide the div with id myDiv1 if the visible property is false
 * @BindVisibleToBoolean("myDiv1")
 * public visible: boolean = true;
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
 * @param htmlElementID the element to bind the event to
 * @param type the event to bind
 * @returns DecoratorCallback
 * @export
 * @group Event Decorators
 * @example
 * @GenericEventSRA("myButton", "click")
 * myButtonClick(e: MouseEventSRA) {
 *    console.log(`Button "${e.idSRA}" was clicked`);
 * }
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
export class MouseEventSRA extends MouseEvent {
    public readonly idSRA: string;
}
/**
 * @description Decorator to bind a click event to an element
 * @param htmlElementID the element to bind the event to
 * @returns DecoratorCallback
 * @export
 * @group Event Decorators
 * @example
 * @ClickSRA("myButton")
 * myButtonClick(e: MouseEventSRA) {
 *   console.log("Button was clicked");
 * }
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
