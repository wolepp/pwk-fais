import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import * as Utils from './utils.js';

var WALL_CHAR = "W";
export const wallConnections = Object.freeze({"UP": 1, "RIGHT": 2, "DOWN": 4, "LEFT": 8});
export const wallConnectionsNums = [8, 4, 2, 1]


function wallColor(wallType) {
    let val = parseInt(wallType, 16);
    let component = val * 17
    let color = component*256*256 + component * 200 + component;
    return color;
}

function fillBlankSpace(space) {
    if (space === WALL_CHAR) return WALL_CHAR;
    return " ";
}

export default class Apartment {
    constructor(length, width) {
        this.length = length;
        this.width = width;
        this.genotype = Utils.createArray(length, width);
        this.phenotype = Utils.createArray(length, width);
        this.putSurroundingWalls();

        //        LENGTH
        // W +---------------+  0
        // I |               |  1
        // D |               |  2  y
        // T |               |  3
        // H +---------------+  4
        //   0 1 2 3 4 5 6 7 8
        //           x

        // genotype: [x][y]
    }
    
    putWall(a, b) {
        let x1 = Math.min(a[0], b[0]);
        let y1 = Math.min(a[1], b[1]);
        let x2 = Math.max(a[0], b[0]);
        let y2 = Math.max(a[1], b[1]);

        if (x1 == x2) {
            for (let y = y1; y <= y2; y++) {
                this.genotype[x1][y] = "W";
            }
        } else if (y1 == y2) {
            for (let x = x1; x <= x2; x++) {
                this.genotype[x][y1] = "W";
            }
        }
    }

    putRandomWall(p=0.3) {
        let wall = Utils.rand(1, 5);
        switch(wall) {
            case 1: // od górnej ściany w dół
                var x = Utils.rand(2, this.length-2);
                var y_start = 1;
                var y_end = y_start + 1;
                while (y_end < this.width - 1 && 
                       (Math.random() < p || !this.isWall(x, y_end))) {
                           y_end++;
                       }
                this.putWall([x, y_start], [x, y_end]);
                break;
            case 2: // od prawej ściany w lewo
                var y = Utils.rand(2, this.width-2);
                var x_start = this.length - 1;
                var x_end = x_start - 1;
                while (x_end > 0 && 
                       (Math.random() < p || !this.isWall(x_end, y))) {
                           x_end--;
                       }
                this.putWall([x_start, y], [x_end, y]);
                break;
            case 3: // od dolnej ściany w górę
                var x = Utils.rand(2, this.length-2);
                var y_start = this.width;
                var y_end = y_start - 1;
                while (y_end > 0 && 
                       (Math.random() < p || !this.isWall(x, y_end))) {
                           y_end--;
                       }
                this.putWall([x, y_start], [x, y_end]);
                break;
            case 4: // od lewej ściany w prawo
                var y = Utils.rand(2, this.width-2);
                var x_start = 0;
                var x_end = x_start + 1;
                while (x_end < this.length - 1 && 
                       (Math.random() < p || !this.isWall(x_end, y))) {
                           x_end++;
                       }
                this.putWall([x_start, y], [x_end, y]);
                break;
        }
    }

    finish() {
        this.makePhenotype();
    }

    isWall(x, y) {
        if (x < 0 || y < 0 || x >= this.length || y >= this.width) return false;
        return this.genotype[x][y] === WALL_CHAR || this.genotype[x][y] > 0;
    }

    makePhenotype() {
        for (let x = 0; x < this.length; x++) {
            for (let y = 0; y < this.width; y++) {
                if (this.isWall(x, y)) {
                    let wallType = 0;
                    if (this.isWall(x  , y-1)) wallType += 1;
                    if (this.isWall(x+1, y  )) wallType += 2;
                    if (this.isWall(x  , y+1)) wallType += 4;
                    if (this.isWall(x-1, y  )) wallType += 8;

                    this.phenotype[x][y] = wallType;
                } else {
                    this.phenotype[x][y] = 0;
                }
            }
        }
    }

    printGenotype() {
        this.genotype = Utils.map(this.genotype, fillBlankSpace);
        Utils.printArray(this.genotype);
    }

    printPhenotype() {
        let hexedPhenotype = Utils.map(this.phenotype, Utils.hex);
        Utils.printArray(hexedPhenotype);
    }

    putSurroundingWalls() {
        this.putWall([0, 0],             [0, this.width-1]);
        this.putWall([0, 0],             [this.length-1, 0]);
        this.putWall([0, this.width-1],  [this.length-1, this.width-1]);
        this.putWall([this.length-1, 0], [this.length-1, this.width-1]);
    }

    initVectors(thickness) {
        let z = 0.0;
        this.VEC_UP = new THREE.Vector3(-z,               (1+thickness)/4, 0);
        this.VEC_RIGHT = new THREE.Vector3((1+thickness)/4,  z,                0);
        this.VEC_DOWN = new THREE.Vector3(z,                -(1+thickness)/4,  0);
        this.VEC_LEFT = new THREE.Vector3(-(1+thickness)/4, -z,               0);
        this.ROT_0 = new THREE.Vector3(0, 0, 0);
        this.ROT_90 = new THREE.Vector3(0, 0, Math.PI/2);
    }

    vectorForType(type) {
        switch(type) {
            case wallConnections.UP:    return this.VEC_UP
            case wallConnections.RIGHT: return this.VEC_RIGHT
            case wallConnections.DOWN:  return this.VEC_DOWN
            case wallConnections.LEFT:  return this.VEC_LEFT
        }
    }

    rotateForType(type) {
        switch(type) {
            case wallConnections.UP: 
            case wallConnections.DOWN:
                return this.ROT_0
            case wallConnections.RIGHT:
            case wallConnections.LEFT:
                return this.ROT_90
        }
    }

    getWallShape(wallType, thickness, height, x, y) {
        let wall = new THREE.Group();
        let color = wallColor(wallType);

        let middlePart = new THREE.Mesh(
            new THREE.BoxGeometry(thickness, thickness, height),
            new THREE.MeshBasicMaterial({color: color})
        );
        middlePart.position.set(x, y, 0);
        wall.add(middlePart);
        
        wallConnectionsNums.forEach((type) => {
            if (wallType - type >= 0) {
                wallType -= type;
                let ksztalt = [thickness, (1-thickness)/2, height];
                let wallPart = new THREE.Mesh(
                    new THREE.BoxGeometry(...ksztalt),
                    new THREE.MeshBasicMaterial({color: color})
                );
                wallPart.position.set(x, y, 0);
                wallPart.position.add(this.vectorForType(type));
                wallPart.rotation.setFromVector3(this.rotateForType(type));
                wall.add(wallPart);
            }
        })
        return wall;
    }

    getPhenotypeShapesGroup(pos_x, pos_y, height = 20, thickness) {
        if (thickness === undefined) {
            thickness = 0.01 * (this.width + this.length) / 2;
        }
        if (thickness > 1) thickness = 1;
        this.initVectors(thickness);
        let shapes = new THREE.Group();
        for (let x = 0; x < this.length; x++) {
            for (let y = 0; y < this.width; y++) {
                if (this.phenotype[x][y] === 0) continue;
                shapes.add(this.getWallShape(this.phenotype[x][y], thickness, height, pos_x + x, -(pos_y + y)));
            }
        }
        return shapes;
    }
}