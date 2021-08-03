export const wallConnections = Object.freeze({"UP": 1, "RIGHT": 2, "DOWN": 4, "LEFT": 8});
export const wallConnectionsNums = [8, 4, 2, 1]

export const ADD_WALL_PROB = 0.5;
// REMOVE_WALL_PROB = 1 - ADD_WALL_PROB

const LENGTH_METERS = 8;
const WIDTH_METERS  = 5;

export const SCALE  = 2;
export const LENGTH = SCALE * LENGTH_METERS + 1
export const WIDTH  = SCALE * WIDTH_METERS + 1;

export const POINTS = {
    AREA: 20,
    RATIO: 6,
    // sum
    MAX_POINTS: 26,
    // penalties
    NO_WINDOWS_PENALTY: 3,
    TOO_SMALL_PENALTY: 20,
}

export const PERFECT_ROOMS = [
    {
        name: "daily",
        mustBe: true,
        mustHaveWindows: true,
        minimumArea: 9,
        optimalArea: 20,
        ratio: 2,
    },
    {
        name: "kitchen",
        mustBe: false,
        mustHaveWindows: true,
        minimumArea: 6,
        optimalArea: 10,
        ratio: 2,
    },
    {
        name: "bathroom",
        mustBe: true,
        mustHaveWindows: false,
        minimumArea: 4,
        optimalArea: 8,
        ratio: 2,
    },
    {
        name: "bedroom",
        mustBe: false,
        mustHaveWindows: true,
        minimumArea: 9,
        optimalArea: 12,
        ratio: 1.5,
    },
    {
        name: "hall",
        mustBe: false,
        mustHaveWindows: false,
        minimumArea: 4,
        optimalArea: 6,
        ratio: 2.5,
    },
]