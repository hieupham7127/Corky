import { Note } from "./note";
import { UUID_generator, to_date } from "./util";

const timeline = document.getElementById("timeline");

export class Timeline {
    private static _instance:Timeline = new Timeline();
    private _items: Item[];
    constructor() {
        if (Timeline._instance) {
            // TODO: create parent Singleton class that is Thread-safe
            throw new Error("Cannot create new instance. Timeline is a singleton");        
        }
        Timeline._instance = this;
        this._items = [];
    }    
    public static getIntance(): Timeline {
        return Timeline._instance;
    }
    public get items(): Item[] {
        return this._items;
    }
    public addItem(): void {
        /*
            TODO: check for Date key
        */
        var item: Item = new Item();
        item.element;
        this._items.push(item);
    }
    public first(): Item {
        return this.items[0];
    }
    public addNote(uuid: string, note: Note): void {
        /*
            Convert items to hashmap<uuid, Item> later
        */
        for ( var item of this.items ) 
            if (uuid == item.uuid) {
                item.addNote(note);
                return;
            }
    }
}

/*
    ATTENTION:
    We don't know how many types of Item aside from Date yet.
    Therefore in the future, Item class will become parent class.
*/
export class Item {
    private _uuid: string;
    private _date: string;
    private _notes: Note[] = [];
    public Item() {
        let uuid = this.uuid;
        let date = this.date;
    }
    get uuid(): string {
        if (!this._uuid)
            this._uuid = UUID_generator();
        return this._uuid;
    }    
    get date(): string {
        if (!this._date)
            this._date = to_date();
        return this._date;    
    }
    get notes(): Note[] {
        return this._notes;
    }
    public addNote(note: Note): void {
        this.notes.push(note);
    }    
    get element(): HTMLElement {
        var element: HTMLElement;
        if ((element = document.getElementById("item-" + this.uuid)) != null) {
            return element;
        }
        /*for (let note of Note.notes)
            if (isSameDay(this.date, note.dates[0])) 
                this.notes.push(note);*/
        element = document.createElement("div");
        element.id = "item-" + this.uuid;
        element.className = "timeline-item";

        var el_date : HTMLElement = document.createElement("div"); 
        el_date.className = "date";
        el_date.innerText = this.date.split(" ")[0];

        var marker : HTMLElement = document.createElement("span");
        marker.className = "marker";
        var dot : HTMLElement = document.createElement("span");
        dot.className = "dot";
        marker.appendChild(dot);
        el_date.appendChild(marker);

        var info : HTMLElement = document.createElement("div"); 
        info.className = "info";
        /*
            Create EventHandler for notes array to automatically update info
            for (let note of this.notes)
                info.innerText += "note-" + note.id + " is modified at " + note.dates[note.dates.length];
        */
        element.appendChild(el_date);
        element.appendChild(info);

        timeline.appendChild(element);
        return element;
    }
}