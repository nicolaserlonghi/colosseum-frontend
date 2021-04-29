import React, {forwardRef, useImperativeHandle, useState, useEffect, useRef, useContext, useLayoutEffect} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import { createMuiTheme } from '@material-ui/core/styles';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';

import { LanguageContext } from 'resources/languages/Language.js';
import CanvasManagerStyle from 'resources/styles/CanvasManagerStyle.jsx';
import WindowDimension from 'helpers/WindowDimensions.jsx';

// Canvas import
import Roshambo from 'canvas/games/Roshambo.js';
import Example from 'canvas/games/Example.js';



const CanvasManager = forwardRef((props, ref) => {
  const containerRef = useRef(null);
  const { componentWidth, componentHeight } = manageWindowDimensions(props, containerRef);
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
    <div 
      ref={containerRef}
      className={classes.canvasContainer}
      style={{ width: `${componentWidth}px`, height: `${componentHeight}px`}}
    >
      <canvas
        className={classes.canvas}
        ref={canvasRef}
        width={componentWidth}
        height={componentHeight}
      />
    </div>
  );
});


function manageWindowDimensions(props, containerRef) {
  const { width, height } = WindowDimension();
  if(!containerRef.current)
    return {};
  const container = containerRef.current;
  const offsetTop = container.offsetTop;
  const theme = createMuiTheme();
  let themeSpacing = theme.spacing(3);
  let marginWidth;
  if(isWidthUp('md', props.width))
    marginWidth = (themeSpacing + 128) * 2;
  else
    marginWidth = themeSpacing * 2;
  let spaceWidth = width - marginWidth;
  let marginHeight = offsetTop + themeSpacing;
  let spaceHeight = height - marginHeight;
  let componentWidth, componentHeight;
  if(spaceHeight < spaceWidth) {
    componentWidth = fromHeight16_9(spaceHeight);
    componentHeight = spaceHeight;
    if(componentWidth > spaceWidth) {
      componentHeight = fromWidth16_9(spaceWidth);
      componentWidth = spaceWidth;
    }
  } else {
    componentHeight = fromWidth16_9(spaceWidth);
    componentWidth = spaceWidth;
    if(componentHeight > spaceHeight) {
      componentWidth = fromHeight16_9(spaceHeight);
      componentHeight = spaceHeight;
    }
  }
  return {
    componentWidth, componentHeight
  };
}

function fromWidth16_9(width) {
  let height = (width * 9) / 16;
  return height;
}

function fromHeight16_9(height) {
  let width = (height * 16) / 9;
  return width;
}

CanvasManager.propTypes = {
  classes: PropTypes.object.isRequired,
  matchInfo: PropTypes.object.isRequired,
}

export default withWidth()(withStyles(CanvasManagerStyle)(CanvasManager));