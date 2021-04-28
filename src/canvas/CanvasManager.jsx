import React, {forwardRef, useImperativeHandle, useState, useEffect, useRef, useContext, useLayoutEffect} from 'react';
import withStyles from "@material-ui/core/styles/withStyles"
import PropTypes from "prop-types"

import Canvas from 'react-responsive-canvas';

import { LanguageContext } from 'resources/languages/Language.js'
import CanvasManagerStyle from 'resources/styles/CanvasManagerStyle.jsx'

import Roshambo from 'canvas/games/Roshambo.js'
import Example from 'canvas/games/Example.js'


const CanvasManager = forwardRef((props, ref) => {
  
  const { classes } = props;
  const matchInfo = props.matchInfo || {};
  const {dictionary, userLanguage} = useContext(LanguageContext);
  const canvasClassRef = useRef(null);
  const canvasRef = useRef(null);


  // Only performed on upload
  useEffect(() => initCanvas(), []);

  const initCanvas = () => {
    const canvasObj = canvasRef.current;
    canvasClassRef.current = new Example(canvasObj, userLanguage);
    // getGameCanvas(canvasObj);
  }

  const getGameCanvas = (canvasObj) => {
    switch(matchInfo.game) {
      case 'roshambo':
        canvasClassRef.current = new Roshambo(canvasObj, userLanguage);
        break;
      default:
        console.log("CANVAS ERR: there is no canvas for the game", matchInfo.game);
    }
  }

  // Done on loading and when there is an event
  // useEffect(() => {
  //   if(!canvasClassRef || !canvasClassRef.current)
  //     return
  //   let canvasClass = canvasClassRef.current
  // });

  useImperativeHandle(ref, () => ({
    manageSpectateMessageStarted(bodyMessage) {
      canvasClassRef.current.started(bodyMessage);
    },

    manageSpectateMessageSynced(bodyMessage) {
      canvasClassRef.current.synced(bodyMessage);
    },

    manageSpectateMessageEnded(bodyMessage) {
      canvasClassRef.current.ended(bodyMessage);
    },

    async manageGameBinaryMessage(blobMessage) {
      canvasClassRef.current.update(blobMessage);
    },
  }));


  return (
    <div className={classes.container}>
      <Canvas
        className={classes.canvas}
        canvasRef={el => canvasRef.current = el}
      />
    </div>
  );

});

CanvasManager.propTypes = {
  classes: PropTypes.object.isRequired,
  matchInfo: PropTypes.object.isRequired,
}
export default withStyles(CanvasManagerStyle)(CanvasManager);