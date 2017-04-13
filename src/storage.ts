import { Note, ISerializedNote } from "./note";
import { Item, ISerializedItem } from "./timeline";


const KEY_NOTE = "corky-notes";
const KEY_TIMELINE = "corky-timeline";

export class NoteStorage {
    static get(): Promise<Note[]> {
        return new Promise<Note[]>(resolve => {
            chrome.storage.sync.get(KEY_NOTE, (dict: { [key: string]: any }) => {
                let data: string = dict[KEY_NOTE] || "[]";
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
            dict[KEY_NOTE] = JSON.stringify(serialized);
            chrome.storage.sync.set(dict, () => {
                resolve();
            });
        });
    }
}

export class ItemStorage {
    static get(): Promise<Item[]> {
        return new Promise<Item[]>(resolve => {
            chrome.storage.sync.get(KEY_TIMELINE, (dict: { [key: string]: any }) => {
                let data: string = dict[KEY_TIMELINE] || "[]";
                let raw_items = JSON.parse(data);
                let items: Item[] = [];
                for (let item_data of raw_items) {
                    let serialized: ISerializedItem = <ISerializedItem>item_data;
                    items.push(Item.deserialize(serialized));
                }
                resolve(items);
            });
        });
    }
    static set(items: Item[]): Promise<void> {
        return new Promise<void>(resolve => {
            var dict = {};
            var serialized: ISerializedItem[] = [];
            for (let item of items) {
                serialized.push(item.serialize());
            }
            dict[KEY_TIMELINE] = JSON.stringify(serialized);
            chrome.storage.sync.set(dict, () => {
                resolve();
            });
        });
    }
}
