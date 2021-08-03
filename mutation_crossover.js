import Apartment, { wallConnections } from './Apartment.js';
import { createArray, printArray, rand } from './utils.js';
import { ADD_WALL_PROB, LENGTH, WIDTH } from './Values.js';

export function mutation(apartment) {
    if (Math.random() < ADD_WALL_PROB) {
        apartment.putRandomWall();
    } else {
        deleteRandomWall(apartment);
    }
    fixWalls(apartment.genotype);
    apartment.finish();
}

export function deleteRandomWall(apartment) {
    let walls = apartment.walls;
    if (walls.length <= 1) {
        return;
    }
    let randomIndex = rand(0, walls.length - 1);
    let deletedWall = walls.splice(randomIndex, 1)[0];
    let deltaX = Math.sign(deletedWall.b.x - deletedWall.a.x);
    let deltaY = Math.sign(deletedWall.b.y - deletedWall.a.y);

    let x_start = deletedWall.a.x + deltaX;
    let x_stop = deletedWall.b.x - deltaX;
    let y_start = deletedWall.a.y + deltaY;
    let y_stop = deletedWall.b.y - deltaY;

    for (let x = x_start, y = y_start;
         !(x == x_stop && y == y_stop); 
         x += deltaX, y += deltaY) {
             apartment.genotype[x][y] = " ";
    }
    fixWalls(apartment.genotype, 0);
    apartment.finish();
}

export function crossover(population) {
    let size = population.length;
    let newPopulation = createArray(size);
    shuffleArray(population);

    if (size % 2 != 0) {
        newPopulation[size-1] = population.pop();
    }
    for (let i = 0; i < population.length; i += 2) {
        let aa = population[i];
        let bb = population[i+1];
        let children = crossTwoApartments(aa, bb);
        newPopulation[i] = children[0];
        newPopulation[i+1] = children[1];
    }
    return newPopulation;
}

function shuffleArray(array) {
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * i)
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
      }
    return array;
}

function crossTwoApartments(aa, bb) {
    let width = aa.genotype.length;
    let crosspoint = width / 2;
    let ab = aa.genotype.slice(0, crosspoint).concat(bb.genotype.slice(crosspoint, width));
    let ba = bb.genotype.slice(0, crosspoint).concat(aa.genotype.slice(crosspoint, width));
    fixWalls(ab);
    fixWalls(ba);

    let apartmentAB = new Apartment(LENGTH, WIDTH);
    apartmentAB.genotype = ab;
    apartmentAB.finish();
    let apartmentBA = new Apartment(LENGTH, WIDTH);
    apartmentBA.genotype = ba;
    apartmentBA.finish();

    return [apartmentAB, apartmentBA];
}

function countConnections(genotype, i, j) {
    let connections = 0;
    let connectionWith = [];
    if (genotype[i][j] !== "W") return {connections: 0};
    if (genotype[i-1] && genotype[i-1][j] === 'W') ++connections && connectionWith.push(i-1, j);
    if (genotype[i+1] && genotype[i+1][j] === 'W') ++connections && connectionWith.push(i+1, j);
    if (genotype[i][j-1] && genotype[i][j-1] === 'W') ++connections && connectionWith.push(i, j-1);
    if (genotype[i][j+1] && genotype[i][j+1] === 'W') ++connections && connectionWith.push(i, j+1);
    return {connections: connections, connectionWith: connectionWith};
}

function fixWalls(genotype, deleteProb = 0.5) {
    let hangingPoints = [];
    for (let i = 1; i < genotype.length-1; i++) { // only inner area
        for (let j = 1; j < genotype[i].length-1; j++) { // only inner area
            if (genotype[i][j] !== 'W') continue; // not a wall
            let c = countConnections(genotype, i, j);
            let connections = c.connections;
            let connectionWith = c.connectionWith;
            if (connections < 2) {
                hangingPoints.push([i, j, connectionWith]);
            }
        }
    }

    // dla każdej "wiszacej" ściany
    hangingPoints.forEach(hangingPoint => {
        let x = hangingPoint[0];
        let y = hangingPoint[1];
        let deltaX = 0;
        let deltaY = 0;

        let filler = "";
        if (Math.random() < deleteProb) {  // randomly delete or finish wall
            filler = " ";
            deltaX = hangingPoint[2][0] - x;
            deltaY = hangingPoint[2][1] - y;
        } else {
            filler = "W";
            deltaX = x - hangingPoint[2][0];
            deltaY = y - hangingPoint[2][1];
        }

        genotype[x][y] = filler;
        while(countConnections(genotype, x, y).connections < 2) {
            genotype[x][y] = filler;
            x += deltaX;
            y += deltaY;
        }
    });
    
}