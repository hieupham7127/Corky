import { Note } from "./note";
import { Storage } from "./storage";

async function init(): Promise<void> {
    let notes = await Storage.get();
}

window["init"] = init;