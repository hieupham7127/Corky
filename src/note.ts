import { randomString } from "./util";

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
    public Note() {
        let id = this.id;
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
    show() {
        console.log(this.id);
    }
    static new(x: number, y: number): Note {
        let note = new Note();
        note.coordinates = { "x": x, "y": y };
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
