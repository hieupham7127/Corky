import { randomString } from "./util";
import { Storage } from "./storage";

const topbar_s: number = 45;
const resizebar_s: number = 10;

export enum NoteType {
    Plain = 0,
    List = 1
}

export interface ISerializedNote {
    id: string;
    type: number;
    lastModified: number;
    coordinates: { x: number, y: number };
    size: { w: number, h: number };
    z: number;
    content: string;
}

export class Note {
    public static notes: Note[] = [];
    private _type: NoteType;
    private x: number;
    private y: number;
    private _width: number;
    private _height: number;
    private z: number;
    private _id: string;
    private _element: HTMLElement;
    public Note(id?: string) {
        if (id) {
            this._id = id;
        }
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
    get width(): number {
        return this._width;
    }
    set width(_width: number) {
        this._width = _width;
    }
    get height(): number {
        return this._height;
    }
    set height(_height: number) {
        this._height = _height;
    }
    get id(): string {
        if (!this._id)
            this._id = randomString();
        return this._id;
    }
    set id(_id: string) {
        this._id = _id;
    }
    get type(): NoteType {
        return this._type;
    }
    set type(type: NoteType) {
        this._type = type;
    }
    get element(): HTMLElement {
        var element: HTMLElement;
        let note: Note = this;
        if ((element = document.getElementById("note-" + this.id)) != null) {
            return element;
        }
        element = document.createElement("div");
        element.id = "note-" + this.id;
        element.className = "note";
        element.style.position = "absolute";
        element.setAttribute("dragging", "");

        var topbar: HTMLElement = document.createElement("div");
        topbar.id = this.id + ":topbar";
        topbar.className = "topbar";
        topbar.style.position = "absolute";
        element.appendChild(topbar);

        for (let position of ["lm", "lb", "mb", "rb", "rm"]) {
            var dragger: HTMLElement = document.createElement("div");
            dragger.id = this.id + ":" + position;
            dragger.className = "dragger " + position;
            dragger.style.position = "absolute";
            dragger.onmousedown = function (event: MouseEvent) {
                element.setAttribute("resizing", position);
                element.setAttribute("startloc", JSON.stringify(note.screenCoordinates));
                element.setAttribute("startdrag", JSON.stringify({ "x": event.clientX, "y": event.clientY }));
                element.setAttribute("startresize", JSON.stringify({ "w": note.width, "h": note.height }));
            };
            element.appendChild(dragger);
        }

        var editor: HTMLElement = document.createElement("div");
        editor.contentEditable = "true";
        editor.id = this.id + ":editor";
        editor.className = "editor";
        editor.style.position = "absolute";
        editor.onkeyup = function (event: KeyboardEvent) {
            Note.save();
        };
        element.appendChild(editor);

        element.onmousedown = function (event: MouseEvent) {
            let target = <HTMLElement>event.target;
            let topbar = <HTMLElement>element.children.namedItem(note.id + ":topbar");
            if (target.id == topbar.id) {
                element.setAttribute("dragging", "true");
                element.setAttribute("startdrag", JSON.stringify({ "x": event.clientX, "y": event.clientY }));
                element.style.cursor = "move";
            }
        };
        element.onmouseup = function (event: MouseEvent) {
            element.setAttribute("dragging", "");
            element.style.cursor = "text";
        };

        let container = document.getElementById("notes");
        container.appendChild(element);
        if (Note.notes.length > 0) {
            document.getElementById("message").innerText = "";
        }
        return element;
    }
    resize(width: number, height: number, center: { x: number, y: number }): void {
        this.width = width;
        this.height = height;
        this.screenCoordinates = center;

        let note = this.element;

        note.style.width = `${width}px`;
        note.style.height = `${height}px`;
        note.style.left = `${center.x - width / 2}px`;
        note.style.top = `${center.y - height / 2}px`;

        let topbar = <HTMLElement>this.element.children.namedItem(this.id + ":topbar");
        topbar.style.width = `${width}px`;
        topbar.style.height = `${topbar_s}px`;
        topbar.style.left = "0";
        topbar.style.top = "0";

        let editor = <HTMLElement>this.element.children.namedItem(this.id + ":editor");
        editor.style.width = `${width - 2 * resizebar_s}px`;
        editor.style.height = `${height - topbar_s - resizebar_s}px`;
        editor.style.left = `${resizebar_s}px`;
        editor.style.top = `${topbar_s}px`;

        let drag_lm = <HTMLElement>this.element.children.namedItem(this.id + ":lm");
        drag_lm.style.width = `${resizebar_s}px`;
        drag_lm.style.height = `${height - resizebar_s - topbar_s}px`;
        drag_lm.style.left = "0";
        drag_lm.style.top = `${topbar_s}px`;

        let drag_lb = <HTMLElement>this.element.children.namedItem(this.id + ":lb");
        drag_lb.style.width = `${resizebar_s}px`;
        drag_lb.style.height = `${resizebar_s}px`;
        drag_lb.style.left = "0";
        drag_lb.style.bottom = "0";

        let drag_mb = <HTMLElement>this.element.children.namedItem(this.id + ":mb");
        drag_mb.style.width = `${width - 2 * resizebar_s}px`;
        drag_mb.style.height = `${resizebar_s}px`;
        drag_mb.style.left = `${resizebar_s}px`;
        drag_mb.style.bottom = "0";

        let drag_rb = <HTMLElement>this.element.children.namedItem(this.id + ":rb");
        drag_rb.style.width = `${resizebar_s}px`;
        drag_rb.style.height = `${resizebar_s}px`;
        drag_rb.style.right = "0";
        drag_rb.style.bottom = "0";

        let drag_rm = <HTMLElement>this.element.children.namedItem(this.id + ":rm");
        drag_rm.style.width = `${resizebar_s}px`;
        drag_rm.style.height = `${height - resizebar_s - topbar_s}px`;
        drag_rm.style.right = "0";
        drag_rm.style.top = `${topbar_s}px`;
    }
    static load(note: Note): void {
        note.element;
        note.resize(note.width, note.height, note.screenCoordinates);
        Note.notes.push(note);
    }
    static new(x: number, y: number): Note {
        let note = new Note();
        note.screenCoordinates = { "x": x, "y": y };
        return note;
    }
    static deserialize(data: ISerializedNote): Note {
        let note = new Note();
        note.id = data.id;
        note.type = data.type;
        note.x = data.coordinates.x;
        note.y = data.coordinates.y;
        note.width = data.size.w;
        note.height = data.size.h;
        note.z = data.z;

        let editor = <HTMLElement>note.element.children.namedItem(note.id + ":editor");
        editor.innerHTML = data.content;
        return note;
    }
    serialize(): ISerializedNote {
        let editor = <HTMLElement>this.element.children.namedItem(this.id + ":editor");
        let data = {
            "type": this.type,
            "lastModified": 0, // TODO
            "id": this.id,
            "coordinates": { "x": this.x, "y": this.y },
            "size": { "w": this.width, "h": this.height },
            "z": this.z,
            "content": editor.innerHTML
        };
        return data;
    }
    static save() {
        Storage.set(Note.notes);
    }
}
