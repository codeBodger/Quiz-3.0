// import { BindValue, EzComponent } from "@gsilber/webez";
import html from "./EzError.component.html";
// import css from "./EzError.component.css";
import { EzComponent } from "@gsilber/webez";

declare const window: Window;

// A manual partial extenssion of EzComponent
export class EzError extends Error {
    private htmlElement;
    private shadow;
    private template;
    constructor(message?: string) {
        super(message);
        this.htmlElement = window.document.createElement("div");
        this.htmlElement.id = "ez-error";
        this.shadow = this.htmlElement.attachShadow({ mode: "open" });
        this.template = window.document.createElement("template");
        this.template.innerHTML = html.replace(
            "ERROR BODY",
            `${`${this.message}`.replace("Error: ", "")}\n${this.stack ?? "NO STACK TRACE"}`,
        );
        const innerDiv = window.document.createElement("div");
        innerDiv.id = "rootTemplate";
        innerDiv.appendChild(this.template.content);
        this.template.content.appendChild(innerDiv);
        this.shadow.appendChild(innerDiv);
        this.shadow.appendChild(this.template.content.cloneNode(true));
        if (!window.onresize) {
            window.onresize = () => {
                EzComponent["resizeEvent"].next({
                    windowWidth: window.innerWidth,
                    windowHeight: window.innerHeight,
                });
            };
        }

        window.document.body.insertAdjacentElement(
            "beforeend",
            this.htmlElement,
        );
    }
}
