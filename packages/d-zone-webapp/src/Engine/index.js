import { Graphics } from 'pixi.js';

const now = global.performance && global.performance.now ? function() {
    return performance.now()
} : Date.now || function () {
    return +new Date()
};

function Engine(viewport) {
    let testBox = new Graphics()
        .beginFill(0x0099ee)
        .drawRect(0, 0, 100, 100);

    console.log(viewport);

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
