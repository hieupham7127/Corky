import { Note } from "./note";

const KEY = "corky-notes";

export class Storage {
    static async get(): Promise<Note[]> {
        return new Promise<Note[]>(resolve => {
            chrome.storage.sync.get(KEY, function (dict: { [key: string]: any }) {
                let data: string = dict[KEY] || "[]";
                console.log(data);
                let notes = JSON.parse(data);
                resolve(notes);
            });
        });
    }
}
