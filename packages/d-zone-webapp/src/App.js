import React, { useEffect } from 'react';
import './App.css';
import Engine from './Engine';

function App() {

    useEffect(() => {
        Engine();
    });

    return (
        <div className='App'>

        </div>
    );
}

export default App;
