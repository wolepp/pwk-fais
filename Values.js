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
    TOO_SMALL_PENALTY: 4,
}

export const PERFECT_ROOMS = {
    DAILY: {
        mustBe: true,
        mustHaveWindows: true,
        minimumArea: 9,
        optimalArea: 20,
        ratio: 2,
    },
    KITCHEN: {
        mustBe: false,
        mustHaveWindows: true,
        minimumArea: 6,
        optimalArea: 10,
        ratio: 2,
    },
    BATHROOM: {
        mustBe: true,
        mustHaveWindows: false,
        minimumArea: 4,
        optimalArea: 8,
        ratio: 2,
    },
    BEDROOM: {
        mustBe: false,
        mustHaveWindows: true,
        minimumArea: 9,
        optimalArea: 12,
        ratio: 1.5,
    },
    HALL: {
        mustHaveWindows: false,
        minimumArea: 4,
        optimalArea: 6,
        ratio: 2.5,
    },
    // BATHROOM: {
    //     mustHaveWindows: false,
    //     minimumArea: 3,
    //     optimalArea: 5,
    //     ratio: 2,
    // },
    // TOILET: {
    //     mustHaveWindows: false,
    //     minimumArea: 1.5,
    //     optimalArea: 3,
    //     ratio: 1.5,
    // },
}