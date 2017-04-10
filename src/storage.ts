import { Note, ISerializedNote } from "./note";

const KEY = "corky-notes";
const MIN_Z = 10;

export class Storage {
    static get(): Promise<Note[]> {
        return new Promise<Note[]>(resolve => {
            chrome.storage.sync.get(KEY, (dict: { [key: string]: any }) => {
                let data: string = dict[KEY] || "[]";
                let raw_notes = JSON.parse(data);
                let notes: Note[] = [];
                for (let note_data of raw_notes) {
                    let serialized: ISerializedNote = <ISerializedNote>note_data;
                    notes.push(Note.deserialize(serialized));
                }
                resolve(notes);
            });
        });
    }
    static set(notes: Note[]): Promise<void> {
        return new Promise<void>(resolve => {
            var dict = {};
            var serialized: ISerializedNote[] = [];
            var zIndices = [];
            for (let note of notes) {
                zIndices.push({ id: note.id, z: note.z });
            }
            zIndices.sort(function (a, b) { return a.z - b.z });
            zIndices = zIndices.map(function (obj) { return obj.id });
            for (let note of notes) {
                let newZ = zIndices.indexOf(note.id) + MIN_Z;
                serialized.push(note.serialize(newZ));
            }
            dict[KEY] = JSON.stringify(serialized);
            chrome.storage.sync.set(dict, () => {
                resolve();
            });
        });
    }
}
