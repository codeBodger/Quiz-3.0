import { EzComponent } from "./EzComponent";
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
