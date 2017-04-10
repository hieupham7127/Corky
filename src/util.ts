export function randomString(length?: number) {
    let _length: number = length || 12;
    var symbols = "abcdefghijklmnopqrstuvwxyz"; symbols += symbols.toUpperCase();
    symbols += "0123456789";
    var str = "";
    for (var i = 0; i < _length; i += 1) {
        var index = ~~(Math.random() * symbols.length);
        str += symbols.charAt(index);
    }
    return str;
}

export function UUID_generator(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}