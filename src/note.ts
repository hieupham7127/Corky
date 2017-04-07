export enum NoteType {
    Plain = 0,
    List = 1
}

export interface ISerializedNote {
    type: number;
}

export class Note {
    private _type: NoteType;
    set type(type: NoteType) {
        this._type = type;
    }
    get type(): NoteType {
        return this._type;
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
