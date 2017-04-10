import { Note } from "./note";
import { Storage } from "./storage";

const notesElement = document.getElementById("notes");

async function ondblclick(event: MouseEvent): Promise<void> {
    if (event.target != notesElement)
        return;
    let note = Note.new(event.clientX, event.clientY);
    note.element;
    note.resize(400, 300, { x: event.clientX, y: event.clientY });
    Note.notes.push(note);
}

function onresize(event: Event) {
    for (let note of Note.notes) {
        note.resize(note.width, note.height, note.screenCoordinates);
    }
}

function onmousemove(event: MouseEvent) {
    if (event.buttons & 1) {
        for (let note of Note.notes) {
            let element = note.element;
            let direction: string;
            if (element.getAttribute("dragging")) {
                var startdrag = JSON.parse(element.getAttribute("startdrag"));
                var px: number = startdrag.x;
                var py: number = startdrag.y;
                var dx = event.clientX - px;
                var dy = event.clientY - py;
                note.resize(note.width, note.height, { x: note.screenCoordinates.x + dx, y: note.screenCoordinates.y + dy })
                element.setAttribute("startdrag", JSON.stringify({ "x": event.clientX, "y": event.clientY }));
            } else if (direction = element.getAttribute("resizing")) {
                var startresize = JSON.parse(element.getAttribute("startresize"));
                var pw: number = startresize.w;
                var ph: number = startresize.h;
                var startloc = JSON.parse(element.getAttribute("startloc"));
                var nx: number = startloc.x;
                var ny: number = startloc.y;
                var startdrag = JSON.parse(element.getAttribute("startdrag"));
                var px: number = startdrag.x;
                var py: number = startdrag.y;
                var dx = event.clientX - px;
                var dy = event.clientY - py;
                switch (direction) {
                    case "lm":
                        if (pw - dx > 64) {
                            note.resize(pw - dx, ph, { x: nx + dx / 2, y: ny });
                        }
                        break;
                    case "lb":
                        if (pw - dx > 64 && ph + dy > 84) {
                            note.resize(pw - dx, ph + dy, { x: nx + dx / 2, y: ny + dy / 2 });
                        }
                        break;
                    case "mb":
                        if (ph + dy > 84) {
                            note.resize(pw, ph + dy, { x: nx, y: ny + dy / 2 });
                        }
                        break;
                    case "rb":
                        if (pw + dx > 64 && ph + dy > 84) {
                            note.resize(pw + dx, ph + dy, { x: nx + dx / 2, y: ny + dy / 2 });
                        }
                        break;
                    case "rm":
                        if (pw + dx > 64) {
                            note.resize(pw + dx, ph, { x: nx + dx / 2, y: ny });
                        }
                        break;
                    default:
                        // fuck you
                        break;
                }
            }
        }
    }
}

async function init(): Promise<void> {
    let notes = await Storage.get();

    for (var note of notes) {
        Note.load(note);
    }

    notesElement.ondblclick = ondblclick;
    notesElement.onmousemove = onmousemove;
    window.onresize = onresize;
}

window["init"] = init;
