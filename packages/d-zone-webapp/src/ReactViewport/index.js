import { Viewport } from 'pixi-viewport';
import { PixiComponent } from '@inlet/react-pixi';

export default PixiComponent('Viewport', {
    create: props => {
        const viewport = new Viewport({
            screenWidth: 500,
            screenHeight: 500,
            worldWidth: 1000,
            worldHeight: 1000,
            ticker: props.app.ticker,
            interaction: props.app.renderer.plugins.interaction,
            disableOnContextMenu: true
        });
        viewport.on('drag-start', () => console.log('drag-start'));
        viewport.on('drag-end', () => console.log('drag-end'));

        viewport
            .drag()
            .pinch()
            .wheel()
            .decelerate();

        return viewport;
    },
    applyProps: (instance, oldProps, newProps) => {
        console.log('applyProps', instance, oldProps, newProps);
    },
    didMount: () => {
        console.log('didMount');
    },
    willUnmount: () => {
        console.log('willUnmount');
    }
});
