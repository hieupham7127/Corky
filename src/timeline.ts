import { Note } from "./note";
import { UUID_generator, to_date, isSameDay } from "./util";

const timeline = document.getElementById("timeline");

export class Timeline {
    private static _instance: Timeline = new Timeline();
    private _items: Item[];
    constructor() {
        if (Timeline._instance) {
            // TODO: create parent Singleton class that is Thread-safe
            throw new Error("Cannot create new instance. Timeline is a singleton");        
        }
        this.items = [];
        Timeline._instance = this;
    }    
    public static getIntance(): Timeline {
        return Timeline._instance;
    }
    get items(): Item[] {
        return this._items;
    }
    set items(items: Item[]) {
        this._items = items;
    }
    public addItem(): void {
        /*
            TODO: check for Date key
        */
        var item: Item = new Item();
        item.element;
        this.items.push(item);
    }
    public first(): Item {
        return this.items[0];
    }
    public findUUID(uuid: string): Item {
        for ( var item of this.items ) 
            if (uuid == item.uuid) 
                return item;
        return null;
    }
    public findDate(date: string): Item {
        for ( var item of this.items ) 
            if (date == item.date) 
                return item;
        return null;
    }
    public addNote(uuid: string, note: Note): void {
        /*
            Convert items to hashmap<uuid, Item> later
            Need to modify findUUID and findDate functions
        */
        this.findUUID(uuid).addNote(note);
    }
    public removeNote(note: Note): void {
        for (let date of note.dates) {
            let item = this.findDate(date);
            item.removeNote(note);
        }
    }
}

/*
    ATTENTION:
    We don't know how many types of Item aside from Date yet.
    Therefore in the future, Item class will become parent class.
*/
export interface ISerializedItem {
    uuid: string;
    date: string;
    notes: string[];
}
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
    public removeNote(target: Note): void {
        let notes = this.notes;
        for (var i = 0; i < notes.length; i++) 
            if (notes[i].id == target.id) {
                notes.splice(i, 1);
                return;
            }
    }
    get element(): HTMLElement {
        var element: HTMLElement;
        if ((element = document.getElementById("item-" + this.uuid)) != null) {
            return element;
        }
        console.log(this.date);
        console.log(Note.notes);
        for (let note of Note.notes)
            if (isSameDay(this.date, note.dates[0])) 
                this.notes.push(note);
        element = document.createElement("div");
        element.id = "item-" + this.uuid;
        element.className = "timeline-item";

        var el_date : HTMLElement = document.createElement("div"); 
        el_date.className = "date";
        el_date.innerText = this.date.split(",")[0];

        let notes = this.notes;
        var info : HTMLElement = document.createElement("div"); 
        info.className = "info";
        info.innerText = "";
        /*
            Create EventHandler for notes array to automatically update info
        */
        for (var i = 0; i < notes.length; i++) {
            let note = notes[i];
            info.innerText += "note-" + note.id 
                            + (note.dates.length == 1 ? " created at " : " last modified at ") 
                            + note.dates[note.dates.length - 1] + "\n";
        }

        var marker : HTMLElement = document.createElement("span");
        marker.className = "marker";
        var dot : HTMLElement = document.createElement("span");
        dot.className = "dot";
        marker.appendChild(dot);
        el_date.appendChild(marker);
        element.appendChild(el_date);
        element.appendChild(info);

        timeline.appendChild(element);
        return element;
    }
    static deserialize(data: ISerializedItem): Item {
        let item = new Item();
        item._uuid = data.uuid;
        item._date = data.date;
        for (let note_id of data.notes)
            item.notes.push(Note.findNoteById(note_id));
        return item;
    }
    serialize(): ISerializedItem {
        var notes: string[] = [];
        for (let note of this.notes)
            notes.push(note.id);
        let data = {
            "uuid": this.uuid,
            "date": this.date,
            "notes": notes            
        };
        return data;
    }
}