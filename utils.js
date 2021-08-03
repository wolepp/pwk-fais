export function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

export function rand(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

export function map(arr, func) {
    var new_arr = createArray(arr.length, arr[0].length);
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            new_arr[i][j] = func(arr[i][j]);
        }
    }
    return new_arr;
}

export function hex(dec) {
    if (dec < 10) return `${dec}`;
    switch (dec) {
        case 10: return "A";
        case 11: return "B";
        case 12: return "C";
        case 13: return "D";
        case 14: return "E";
        case 15: return "F";
    }
}

export function dec(hex) {
    return parseInt(hex, 16);
}

export function printArray(arr) {
    let str = "";
    for (let y = 0; y < arr.length; y++) {
        let row = "";
        for (let x = 0; x < arr[0].length; x++) {
            row += arr[y][x];
        }
        str += row + "\n";
    }
    console.log(str);
}