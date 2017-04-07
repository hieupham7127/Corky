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