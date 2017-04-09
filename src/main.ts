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
    if (Note.notes.length > 0) {
        document.getElementById("message").innerText = "";
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
                var left = parseInt(document.getElementById(element.id).style.left);
                var top = parseInt(document.getElementById(element.id).style.top);
                document.getElementById(element.id).style.left = (left + dx) + "px";
                document.getElementById(element.id).style.top = (top + dy) + "px";
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
                var resizeH = function (moveLeft: boolean) {
                    if (pw + dx > 64) {
                        note.resize(pw + dx, ph, { x: nx + dx / 2, y: ny });
                    }
                };
                switch (direction) {
                    case "rm":
                        resizeH(false);
                        break;
                }
            }
        }
    }
}

async function init(): Promise<void> {
    Note.notes = await Storage.get();
    notesElement.ondblclick = ondblclick;
    notesElement.onmousemove = onmousemove;
}

window["init"] = init;
