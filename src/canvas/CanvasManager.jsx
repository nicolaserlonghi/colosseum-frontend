import React from 'react';

import { useCanvas } from 'canvas/UseCanvas.js';
import 'canvas/CanvasStyle.css';


function CanvasManager() {
  
  const [ coordinates, setCoordinates, canvasRef, canvasWidth, canvasHeight ] = useCanvas();

  const handleCanvasClick=(event)=>{
    // on each click get current mouse location 
    const currentCoord = { x: event.pageX - event.target.offsetLeft, y: event.pageY - event.target.offsetTop};
    // add the newest mouse location to an array in state 
    setCoordinates([...coordinates, currentCoord]);
  };

  const handleClearCanvas=(event)=>{
    setCoordinates([]);
  };

  return (
    <main className="App-main" >
      <canvas 
        className="App-canvas"
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        onClick={handleCanvasClick} />

      <div className="button" >
        <button onClick={handleClearCanvas} > CLEAR </button>
      </div>
    </main>
  );

};

export default CanvasManager;