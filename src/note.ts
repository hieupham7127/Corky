export interface ISerializedNote {

}

export class Note {
    static deserialize(data: ISerializedNote): Note {
        return new Note();
    }
    serialize(): ISerializedNote {
        return {};
    }
}
