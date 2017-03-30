import { Note, ISerializedNote } from "./note";

const KEY = "corky-notes";

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
            for (let note of notes) {
                serialized.push(note.serialize());
            }
            dict[KEY] = JSON.stringify(serialized);
            chrome.storage.sync.set(dict, () => {
                resolve();
            });
        });
    }
}
