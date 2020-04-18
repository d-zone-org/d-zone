import React from 'react';
import './App.css';
import { Stage, useApp } from '@inlet/react-pixi';
import ReactViewport from './ReactViewport';
import Engine from './Engine';

const ReactPixiViewport = React.forwardRef(({ children }, ref) => {
    const app = useApp();
    return <ReactViewport app={app} ref={ref}>{children}</ReactViewport>;
});

function App() {
    const refViewport = React.useCallback(node => {
        if(node !== null) {
            Engine(node);
        }
    }, []);

    return (
        <div className='App'>
            <Stage width={500} height={500} options={{ autoResize: true, sharedTicker: true }}>
                <ReactPixiViewport ref={refViewport} />
            </Stage>
        </div>
    );
}

export default App;
