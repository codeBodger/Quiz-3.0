"use strict";

const { BindStyle } = require("@gsilber/webez/bind.decorators");

Object.defineProperty(exports, "__esModule", { value: true });
exports.ClickSRA =
    exports.GenericEventSRA =
    exports.BindVisibleToBooleanSRA =
    exports.BindCSSClassToBooleanSRA =
        void 0;

/**A bunch of stuff I had to take from the WebEZ source, since it wasn't exported
 * It's possible that I modified some of it, but I don't think I did */

/**
 * @description Gets the public key of the field name
 * @param name the name of the field
 * @returns the public key
 * @ignore
 */
function getPublicKey(name) {
    return String(name);
}
/**
 * @description Gets the private key of the field name
 * @param name the name of the field
 * @returns the private key
 * @ignore
 */
function getPrivateKey(name) {
    return `__${String(name)}`;
}
/**
 * @description replaces a property with a new setter and the default getter.  The new setter can call the original setter.
 * @param target the class to replace the setter in
 * @param name the property to replace the setter for
 * @param value the initial value of the property
 * @param setter the new setter to replace the original setter with, this does not need to update the hidden private property.
 * @param callSetterFirst if true, the setter is called before the original setter, otherwise it is called after.
 * @ignore
 */
function hookProperty(target, name, value, setter, callSetterFirst = false) {
    const publicKey = getPublicKey(name);
    const privateKey = getPrivateKey(name);
    Object.defineProperty(target, privateKey, {
        value,
        writable: true,
        enumerable: false,
        configurable: true,
    });
    Object.defineProperty(target, publicKey, {
        get() {
            return this[privateKey];
        },
        set(value) {
            if (callSetterFirst) setter(value);
            this[privateKey] = value;
            if (!callSetterFirst) setter(value);
        },
        enumerable: true,
        configurable: true,
    });
}
/**
 * @description Replace setter and getter with the ones provided.  These may call the original setter and getter.
 * @param target the class to replace the setter and getter in
 * @param name the property to replace the setter and getter for
 * @param origDescriptor the original property descriptor
 * @param setter the new setter to replace the original setter with, this does not need to update the hidden private property.
 * @param callSetterFirst if true, the setter is called before the original setter, otherwise it is called after.
 * @ignore
 */
function hookPropertySetter(
    target,
    name,
    origDescriptor,
    setter,
    callSetterFirst = false,
) {
    const publicKey = getPublicKey(name);
    Object.defineProperty(target, publicKey, {
        get: origDescriptor.get, // Leave the get accessor as it was
        set(value) {
            if (callSetterFirst) setter(value);
            if (origDescriptor.set) {
                origDescriptor.set.call(target, value); // Call the original set accessor with the provided value
            }
            if (!callSetterFirst) setter(value);
        },
        enumerable: origDescriptor.enumerable,
        configurable: origDescriptor.configurable,
    });
}
/**
 * @description Returns a property descriptor for a property in this class
 * @param target the class to get the property descriptor from
 * @param key the property to get the descriptor for
 * @returns PropertyDescriptor
 * @throws Error if the property descriptor is not found
 * @ignore
 */
function getPropertyDescriptor(target, key) {
    let origDescriptor = Object.getOwnPropertyDescriptor(target, key);
    /* this can't happen.  Just here for type safety checking*/
    if (!origDescriptor) {
        throw new Error(`can not find setter with name: ${key}`);
    }
    return origDescriptor;
}

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
function BindCSSClassToBooleanSRA(
    id,
    cssClassName,
    transform = (value) => value,
) {
    return function (target, context) {
        context.addInitializer(function () {
            const element = this["shadow"].getElementById(id);
            if (!element) {
                throw new Error(`can not find HTML element with id: ${id}`);
            }
            const publicKey = getPublicKey(context.name);
            const origDescriptor = getPropertyDescriptor(this, publicKey);
            const value = context.access.get(this);
            let setfn;
            setfn = (value) => {
                let valArray = cssClassName
                    .split(" ")
                    .filter((v) => v.length > 0);
                let classes = element.className
                    .split(" ")
                    .filter((v) => !!v)
                    .filter((v) => !valArray.includes(v));
                if (transform.call(this, value)) {
                    valArray.forEach((v) => {
                        classes.push(v);
                    });
                }
                element.className = classes.join(" ");
            };
            setfn(value);
            if (origDescriptor.set) {
                hookPropertySetter(this, context.name, origDescriptor, setfn);
            } else {
                hookProperty(this, context.name, value, setfn);
            }
        });
    };
}
exports.BindCSSClassToBooleanSRA = BindCSSClassToBooleanSRA;
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
function BindVisibleToBooleanSRA(id, transform = (value) => value) {
    return BindStyle(id, "display", (value) => {
        const t = transform(value);
        // console.log(value, t, t ? "unset" : "none");
        return t ? "unset" : "none";
    });
}
exports.BindVisibleToBooleanSRA = BindVisibleToBooleanSRA;

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
function GenericEventSRA(htmlElementID, type) {
    return function (target, context) {
        context.addInitializer(function () {
            let element = this["shadow"].getElementById(htmlElementID);
            if (element) {
                element.addEventListener(type, (e) => {
                    if (type === "input" || type === "change")
                        if (element.type === "checkbox") {
                            e.value = element.checked ? "on" : "";
                        } else {
                            e.value = element.value;
                        }
                    e.idSRA = htmlElementID;
                    target.call(this, e);
                });
            }
        });
    };
}
exports.GenericEventSRA = GenericEventSRA;
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
function ClickSRA(htmlElementID, idSRA) {
    return GenericEventSRA(htmlElementID, "click", idSRA);
}
exports.ClickSRA = ClickSRA;
