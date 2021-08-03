import * as THREE from 'https://cdn.skypack.dev/three/build/three.module.js';
import Apartment from './Apartment.js';
import {
    fit
} from './Evaluator.js';
import {
    createArray
} from './utils.js';
import {
    LENGTH,
    WIDTH
} from './Values.js';
import {
    mutation,
    crossover
} from './mutation_crossover.js';

import {
    TrackballControls
} from 'https://cdn.skypack.dev/three/examples/jsm/controls/TrackballControls.js';

var camera, scene, renderer, controls;

var N_OSOBNIKOW = 1000;
var MUTATION_PROB = 0.3;
var NUMBER_INDIVIDUALS_TO_DRAW = 10;
var INIT_WALLS_MIN = 2;
var BEST_INDIVIDUAL_PERCENTAGE_NEXT_GEN = 0.05;
var INIT_WALLS_MAX = 5;
var populacja = createArray(N_OSOBNIKOW);
var populationCounter = 1;

setButtons();
init();
animate();
initPopulation();

function setButtons() {
    document.getElementById("koniecBtn").addEventListener("click", () => finishEvolution());
    document.getElementById("1").addEventListener("click", () => nextGenerations(1));
    document.getElementById("10").addEventListener("click", () => nextGenerations(10));
    document.getElementById("100").addEventListener("click", () => nextGenerations(100));
    document.getElementById("1000").addEventListener("click", () => nextGenerations(1000));
}

function initPopulation() {
    for (let i = 0; i < N_OSOBNIKOW; i++) {
        let individual = new Apartment(LENGTH, WIDTH);
        let wallsCount = rand(INIT_WALLS_MIN, INIT_WALLS_MAX);
        for (let j = 0; j < wallsCount; j++) {
            individual.putRandomWall();
        }
        individual.finish();
        fit(individual);
        populacja[i] = individual;
    }
    drawPopulation(populacja, false);
}

function nextGenerations(count) {
    for (let i = 0; i < count; i++) {
        populationCounter++;
        console.info("Populacja nr: " + populationCounter)
        populacja = select(populacja);
        populacja = crossover(populacja);
        for (let j = 0; j < N_OSOBNIKOW; j++) {
            if (Math.random() < MUTATION_PROB) {
                mutation(populacja[j]);
            }
            fit(populacja[j]);
        }
        drawPopulation(populacja);
    }
}

function finishEvolution() {
    resetScene();
    populacja.sort((a, b) => {
        return b.fitness - a.fitness
    });
    let population3d = new THREE.Group();
    let fitness = populacja[0].fitness;
    let model3d = populacja[0].getPhenotypeShapesGroup(0, 0, 1);
    population3d.add(model3d);
    let scoreSprite = makeTextSprite(fitness.toPrecision(3));
    scoreSprite.position.set(25, 0, 1);
    scene.add(scoreSprite);
    scene.add(population3d);
}

function drawPopulation(population, withSort = true) {
    resetScene();
    if (withSort) {
        population.sort((a, b) => {
            return b.fitness - a.fitness
        });
    }
    let population3d = new THREE.Group();
    for (let i = 0; i < Math.min(NUMBER_INDIVIDUALS_TO_DRAW, population.length); i++) {
        let fitness = population[i].fitness;
        let x_pos = i * LENGTH * 1.2;
        let model3d = population[i].getPhenotypeShapesGroup(x_pos, 0, 1);
        population3d.add(model3d);
        let scoreSprite = makeTextSprite(fitness.toPrecision(3));
        scoreSprite.position.set(x_pos + 25, 0, 1);
        scene.add(scoreSprite);
    }
    scene.add(population3d);
}

function select(pokolenie) {
    let liczebnosc = pokolenie.length;
    let nowePokolenie = createArray(liczebnosc);
    let procentNowegoPokolenia = BEST_INDIVIDUAL_PERCENTAGE_NEXT_GEN;
    let nowychOsobnikow = 0;

    let ranking = pokolenie.sort((a, b) => b.fitness - a.fitness);
    let pozycjaOsobnika = 0;

    while (nowychOsobnikow < liczebnosc) {
        let liczbaKopii = procentNowegoPokolenia * liczebnosc + 1;
        if (liczbaKopii + nowychOsobnikow > liczebnosc) {
            liczbaKopii = liczebnosc - nowychOsobnikow;
        }
        for (let i = 0; i < liczbaKopii; i++) {
            nowePokolenie[nowychOsobnikow] = ranking[pozycjaOsobnika].copy();
            nowychOsobnikow++;
        }
        procentNowegoPokolenia *= 0.5;
        pozycjaOsobnika++;
    }

    return nowePokolenie;
}

function rand(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function makeTextSprite(message, parameters) {
    if (parameters === undefined) parameters = {};

    var fontface = parameters.hasOwnProperty("fontface") ?
        parameters["fontface"] : "Arial";

    var fontsize = parameters.hasOwnProperty("fontsize") ?
        parameters["fontsize"] : 18;

    var borderThickness = parameters.hasOwnProperty("borderThickness") ?
        parameters["borderThickness"] : 2;

    var borderColor = parameters.hasOwnProperty("borderColor") ?
        parameters["borderColor"] : {
            r: 0,
            g: 0,
            b: 0,
            a: 1.0
        };

    var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
        parameters["backgroundColor"] : {
            r: 255,
            g: 255,
            b: 255,
            a: 1.0
        };


    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.font = "Bold " + fontsize + "px " + fontface;

    // get size data (height depends only on font size)
    var metrics = context.measureText(message);
    var textWidth = metrics.width;

    // background color
    context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," +
        backgroundColor.b + "," + backgroundColor.a + ")";
    // border color
    context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," +
        borderColor.b + "," + borderColor.a + ")";

    context.lineWidth = borderThickness;
    roundRect(context, borderThickness / 2, borderThickness / 2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
    // 1.4 is extra height factor for text below baseline: g,j,p,q.

    // text color
    context.fillStyle = "rgba(0, 0, 0, 1.0)";

    context.fillText(message, borderThickness, fontsize + borderThickness);

    // canvas contents will be used for a texture
    var texture = new THREE.Texture(canvas)
    texture.needsUpdate = true;

    var spriteMaterial = new THREE.SpriteMaterial({
        map: texture
    });
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(40, 20, 1.0);
    return sprite;
}

// function for drawing rounded rectangles
function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function init() {
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth - 20, window.innerHeight - 150);
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    camera = new THREE.PerspectiveCamera(55, (window.innerWidth - 20) / (window.innerHeight - 150), 1, 1000);
    camera.position.set(0, 0, 100);

    controls = new TrackballControls(camera, renderer.domElement);
    controls.minDistance = 10;
    controls.maxDistance = 150;

    scene.add(new THREE.AmbientLight(0x222222));

    var light = new THREE.PointLight(0xffffff);
    light.position.copy(camera.position);
    scene.add(light);
}

function resetScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.add(new THREE.AmbientLight(0x222222));

    var light = new THREE.PointLight(0xffffff);
    light.position.copy(camera.position);
    scene.add(light);
}


function animate() {

    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);

}