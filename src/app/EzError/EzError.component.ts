// import { BindValue, EzComponent } from "@gsilber/webez";
import html from "./EzError.component.html";
// import css from "./EzError.component.css";
import { EzComponent } from "@gsilber/webez";

declare const window: Window;

// export class EzErrorComponent extends EzComponent {
//     // @BindValue("body")
//     private body: string = "";

//     constructor(name: string, stackTrace: string) {
//         super(
//             html.replace(
//                 "ERROR BODY",
//                 `${`${name}`.replace("Error: ", "")}\n${stackTrace}`,
//             ),
//             css,
//         );
//         this.body = `${`${name}`.replace("Error: ", "")}\n${stackTrace}`;
//     }

//     // insertComponent(id: string = "root"): void {
//     //     window.document.getElementById(id);
//     //     const el = window.document.getElementById(id);
//     //     (id === "root" || el === null ?
//     //         window.document.getElementsByTagName("body")[0].appendChild
//     //     :   el.appendChild)(this["htmlElement"]);
//     //     // if (id === "root") {
//     //     //     window.document.body.appendChild(this.htmlElement);
//     //     // } else {
//     //     //     let el = window.document.getElementById(id);
//     //     //     if (el) {
//     //     //         el.appendChild(this.htmlElement);
//     //     //     }
//     //     // }
//     // }
//     insert(id?: string) {
//         let element = window.document.body;
//         if (id) {
//             const elem = window.document.getElementById(id);
//             if (elem) {
//                 // this.appendToDomElement(elem);
//                 // return;
//                 element = elem;
//             }
//         }
//         // this.appendToDomElement(window.document.body);
//         console.log(this["html"]);
//         element.insertAdjacentHTML("beforeend", this["html"]);
//         // window.document.getElementById("webpack-dev-server-client-overlay").;
//     }
// }

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
        // bootstrap(
        //     EzErrorComponent,
        //     undefined,
        //     this.name,
        //     this.stack ?? "NO STACK TRACE",
        // );
        // new EzErrorComponent(
        //     this.name,
        //     this.stack ?? "NO STACK TRACE",
        // ).insert();
    }
}
