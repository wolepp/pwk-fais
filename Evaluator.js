import { SCALE, PERFECT_ROOMS, POINTS, wallConnections, wallConnectionsNums } from './Values.js'

export function fit(apartment) {
    let rooms = getRooms(apartment);
    if (rooms.length > 10) return 0;    // dwie ściany zaraz przy sobie - mnóstwo pokoi


    evaluateFunctions(rooms);
    assignFunction(rooms);

    let sum = 0;
    rooms.forEach((room) => {
        sum += room.fitness;
        // console.log(`Funkcja: ${room.function}, punkty: ${room.fitness}`);
    })
    return sum;
}

function getRooms(apartment) { 
    let upperLeftCorners = _getUpperLeftCorners(apartment);

    let rooms = [];
    let pointPairs = _getPointPairs(upperLeftCorners, apartment);
    pointPairs.forEach(pointPair => {
        let length = (pointPair.bottomRight.x - pointPair.upperLeft.x) / SCALE;
        let width = (pointPair.bottomRight.y - pointPair.upperLeft.y) / SCALE;
        rooms.push({
            corners: {
                upperLeft: pointPair.upperLeft,
                bottomRight: pointPair.bottomRight,
                upperRight: {
                    x: pointPair.bottomRight.x,
                    y: pointPair.upperLeft.y
                },
                bottomLeft: {
                    x: pointPair.upperLeft.x,
                    y: pointPair.bottomRight.y
                }
            },
            length: length,
            width: width,
            area: length * width,
            ratio: (Math.max(length, width) / Math.min(length, width)),
        });
    });
    return rooms;
}

function _getUpperLeftCorners(apartment) {
    let upperLeftCorners = [];
    let phenotype = apartment.phenotype;
    for (let x = 0; x < apartment.length; x++) {
        for (let y = 0; y < apartment.width; y++) {
            if (_isUpperLeftCorner(phenotype[x][y])) {
                upperLeftCorners.push({x: x, y: y});
            }
        }
    }
    return upperLeftCorners;
}

function _isUpperLeftCorner(wallPiece) {
    return wallPiece === 6  // w prawo, w dół
        || wallPiece === 7  // w prawo, w dół, w górę
        || wallPiece === 14 // w prawo, w dół, w lewo
        || wallPiece === 15 // w każdą stronę
}

function _getPointPairs(upperLeftCorners, apartment) {
    let pairs = [];
    upperLeftCorners.forEach(upperLeftCorner => {
        pairs.push({
            upperLeft: upperLeftCorner,
            bottomRight: _findOppositePoint(upperLeftCorner, apartment)
        });
    });
    return pairs;
}

function _findOppositePoint(upperLeftPoint, apartment) {
    let walls = apartment.phenotype;
    let oppositePoint = {
        x: upperLeftPoint.x + 1,
        y: upperLeftPoint.y + 1
    };
    while (! _isWall(walls[oppositePoint.x][oppositePoint.y])) {
        oppositePoint.x++;
    }
    while (! _isBottomRightCorner(walls[oppositePoint.x][oppositePoint.y])) {
        oppositePoint.y++;
    }
    return oppositePoint;
}

function _isBottomRightCorner(wallPiece) {
    return wallPiece === 9  // w górę, w lewo
        || wallPiece === 11 // w górę, w lewo, w prawo
        || wallPiece === 13 // w górę, w lewo, w dół
        || wallPiece === 15 // w każdą stronę
}

function _isWall(wallPiece) {
    return wallPiece > 0;
}

function evaluateFunctions(rooms) {
    rooms.forEach(room => {
        room.functions = _assignFunctionsSorted(room);
        // room.function = room.functions[bestFunctionIdx].func;
        // room.fitness = room.functions[bestFunctionIdx].points;
    });
}

function assignFunction(rooms) {
    const mustBeRooms = PERFECT_ROOMS.filter(attributes => attributes.mustBe === true)
    const optionalRooms = PERFECT_ROOMS.filter(attributes => attributes.mustBe === false)

    let chosenRooms = [];
    mustBeRooms.forEach(mustBeRoom => {
        let maxPoints = 0;
        let chosenRoom;
        rooms.forEach(room => {
            console.log(room)
            room.functions.forEach(({func, points}) => {
                if (func === mustBeRoom.name
                     && points > maxPoints
                     && ! chosenRooms.includes(room)) {
                    console.log(`func: ${func}, points: ${points}`)
                    chosenRoom = room;
                    maxPoints = points;
                }
            })
        });
        chosenRooms.push(chosenRoom)
    });
}

function _assignFunctionsSorted(room) {
    let functions = [];
    PERFECT_ROOMS.forEach(perfectRoom => {
        functions.push({
            func: perfectRoom.name,
            points: _pointsForFunction(room, perfectRoom)
        })
    })
    functions.sort((a, b) => {return b.points - a.points});
    return functions;
}

function _pointsForFunction(room, candidateRoom) {
    let points = 0;

    if (Math.abs(candidateRoom.optimalArea - room.area) === 0) {
        points += POINTS.AREA;
    } else {
        points += (1 / Math.ceil(Math.abs(candidateRoom.optimalArea - room.area))) * POINTS.AREA;
    }

    if (Math.abs(candidateRoom.ratio - room.ratio) === 0) {
        points += POINTS.RATIO;
    } else {
        points += (1 / Math.ceil(Math.abs(candidateRoom.ratio - room.ratio))) * POINTS.RATIO;
    }
    
    if (candidateRoom.mustHaveWindows && ! _hasWindows(room)) {
        points -= POINTS.NO_WINDOWS_PENALTY;
    }

    if (room.area < candidateRoom.minimumArea) {
        points -= POINTS.TOO_SMALL_PENALTY;
    }

    return points;
}

function _hasWindows(room) {
    return room.corners.upperLeft.y === 0
        || room.corners.upperLeft.x === 0;
}