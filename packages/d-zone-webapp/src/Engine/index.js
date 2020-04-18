import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';

// Override renderer create function to use custom WebGL test
PIXI.Renderer.create = function create (options) {
    if (isWebGLSupported()) {
        return new PIXI.Renderer(options);
    }
    throw new Error('WebGL unsupported in this browser, use "pixi.js-legacy" for fallback canvas2d support.');
};

// WebGL support test function from Three.js
function isWebGLSupported () {
    try {
        let canvas = document.createElement('canvas');
        return !!window.WebGLRenderingContext &&
            (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch(e) {
        return false;
    }
}

const app = new PIXI.Application({
    width: 1280,
    height: 720
});
document.body.appendChild(app.view);

const viewport = new Viewport({
    screenWidth: 1280,
    screenHeight: 720,
    worldWidth: 1000,
    worldHeight: 1000,
    interaction: app.renderer.plugins.interaction,
    disableOnContextMenu: true
});

app.stage.addChild(viewport);

viewport.on('drag-start', () => console.log('drag-start'));
viewport.on('drag-end', () => console.log('drag-end'));

viewport
    .drag()
    .pinch()
    .wheel()
    .decelerate();

const now = global.performance && global.performance.now ? function() {
    return performance.now()
} : Date.now || function () {
    return +new Date()
};

let testBox = new PIXI.Graphics()
    .beginFill(0x0099ee)
    .drawRect(0, 0, 100, 100);

function Engine() {

    console.log('engine started');

    viewport.addChild(testBox);

    const stepTime = 1000/60;
    let deltaTime = 0;
    let lastUpdate = 0;
    const interval = () => {
        deltaTime += now() - lastUpdate;
        if(deltaTime >= stepTime) {
            while(deltaTime >= stepTime) {
                deltaTime -= stepTime;
                testBox.x++;
                testBox.y++;
            }
        }
        lastUpdate = now();
    }
    const gameLoop = setInterval(interval, stepTime);
}

export default Engine;
