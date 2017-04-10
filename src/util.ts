export function randomString(length?: number) {
    let _length: number = length || 12;
    var alphabet = "abcdefghijklmnopqrstuvwxyz"; alphabet += alphabet.toUpperCase();
    var string = "";
    for (var i = 0; i < _length; i += 1) {
        var index = ~~(Math.random() * alphabet.length);
        string += alphabet.charAt(index);
    }
    return string;
}

export function findHighestZIndex(elem = "div") {
    var elems = document.getElementsByTagName(elem);
    var highest = 0;
    for (var i = 0; i < elems.length; i++) {
        var zindex = document.defaultView.getComputedStyle(elems[i], null).getPropertyValue("z-index");
        if ((parseInt(zindex) > highest) && (zindex != 'auto')) {
            highest = parseInt(zindex);
        }
    }
    return highest;
}
