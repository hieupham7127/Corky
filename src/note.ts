import { randomString } from "./util";

const DEFAULT_WIDTH = 400;
const DEFAULT_HEIGHT = 300;

export enum NoteType {
    Plain = 0,
    List = 1
}

export interface ISerializedNote {
    type: number;
}

export class Note {
    private _type: NoteType;
    private x: number;
    private y: number;
    private _id: string;
    private _element: HTMLElement;
    public Note() {
        let id = this.id;
    }
    get screenCoordinates(): { x: number, y: number } {
        return { "x": this.x * window.innerWidth, "y": this.y * window.innerHeight };
    }
    set screenCoordinates(coordinates: { x: number, y: number }) {
        this.x = coordinates.x / window.innerWidth;
        this.y = coordinates.y / window.innerHeight;
    }
    get coordinates(): { x: number, y: number } {
        return { "x": this.x, "y": this.y };
    }
    set coordinates(coordinates: { x: number, y: number }) {
        this.x = coordinates.x;
        this.y = coordinates.y;
    }
    get id(): string {
        if (!this._id)
            this._id = randomString();
        return this._id;
    }
    get type(): NoteType {
        return this._type;
    }
    set type(type: NoteType) {
        this._type = type;
    }
    get element(): HTMLElement {
        var element: HTMLElement;
        if ((element = document.getElementById("note-" + this.id)) != null)
            return element;
        element = document.createElement("div");
        element.id = "note-" + this.id;
        element.className = "note";
        element.style.position = "absolute";
        element.style.width = `${DEFAULT_WIDTH}px`;
        element.style.height = `${DEFAULT_HEIGHT}px`;
        element.style.left = `${this.screenCoordinates.x - DEFAULT_WIDTH / 2}px`;
        element.style.top = `${this.screenCoordinates.y - DEFAULT_HEIGHT / 2}px`;
        element.setAttribute("dragging", "");
        element.onmousemove = function (event: MouseEvent) {
            if (event.target == element && event.buttons & 1) {
                var startdrag = JSON.parse(this.getAttribute("startdrag"));
                var px = startdrag.x;
                var py = startdrag.y;
                var dx = event.clientX - px;
                var dy = event.clientY - py;
                var left = parseInt(document.getElementById(element.id).style.left);
                var top = parseInt(document.getElementById(element.id).style.top);
                document.getElementById(element.id).style.left = (left + dx) + "px";
                document.getElementById(element.id).style.top = (top + dy) + "px";
                element.setAttribute("startdrag", JSON.stringify({ "x": event.clientX, "y": event.clientY }));
            }
        };
        element.onmousedown = function (event: MouseEvent) {
            if (event.target == element) {
                element.setAttribute("dragging", "true");
                element.setAttribute("startdrag", JSON.stringify({ "x": event.clientX, "y": event.clientY }));
                element.style.cursor = "move";
            }
        };
        element.onmouseup = function (event: MouseEvent) {
            element.setAttribute("dragging", "");
            element.style.cursor = "text";
        };

        var topbar: HTMLElement = document.createElement("div");
        return element;
    }
    show() {
        let container = document.getElementById("notes");
        console.log(this.element);
        container.appendChild(this.element);
    }
    static new(x: number, y: number): Note {
        let note = new Note();
        note.screenCoordinates = { "x": x, "y": y };
        return note;
    }
    static deserialize(data: ISerializedNote): Note {
        let note = new Note();
        note.type = data.type;
        return note;
    }
    serialize(): ISerializedNote {
        let data = {
            "type": this.type
        };
        return data;
    }
}
