import { Note } from "./note";
import { Storage } from "./storage";

const notesElement = document.getElementById("notes");
let notes: Note[] = [];

async function onclick(event: MouseEvent): Promise<void> {
    if (event.target != notesElement)
        return;
    let note = Note.new(event.clientX, event.clientY);
    note.show();
    notes.push(note);
}

async function init(): Promise<void> {
    notes = await Storage.get();

    notesElement.onclick = onclick;
}

window["init"] = init;
