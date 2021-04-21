import React, {forwardRef, useImperativeHandle} from 'react';

import { useCanvas } from 'canvas/UseCanvas.js';
import 'canvas/CanvasStyle.css';



const CanvasManager = forwardRef((props, ref) => {

  
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


  useImperativeHandle(ref, () => ({

    manageSpectateMessageStarted(bodyMessage) {
      // Manage started message from API
    },

    manageSpectateMessageSynced(bodyMessage) {
      // Manage synced message from API
    },

    async manageGameBinaryMessage(bodyMessage) {
      // Manage binary message from API
      // bodyMessage is a blob type, this is an example of how to convert it
      let text = await (new Response(bodyMessage)).text();
      console.log('text: ', text);
    },
  }));

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

});

export default CanvasManager;