// import { css } from 'astroturf';
import React from 'react';
// import ReactDOM from 'react-dom';
import MainHeroGroupContext from './MainHeroGroupContext';
import { useImageSize } from 'react-image-size';
import { useResizeObserver} from "react-ext-hooks";
// import { position, width } from 'dom-helpers';
const maxHeight = 600;
const aspectRatio = 1 / 2;
const offsetFrontRatio = 1/5;
const offsetParallaxRatio = 1/10;
const effectParallaxOffset = 10;

function calculateDisplayDimensions(imageSize, frameWidth) {
  let result = { width: 0, height: 0 };
  const width = imageSize?.width;
  const height = imageSize?.height;
  if (!width || !height || !frameWidth) return result;
  const frameHeight = Math.min(maxHeight, frameWidth * aspectRatio);
  result.height = frameHeight;
  const estimatedWidth = (frameHeight / height) * width;
  result.width = estimatedWidth;
  return result;
}

const initStyleFrame = { height: `min(${maxHeight}px,calc(100vw * ${aspectRatio}))` };
const initStyleRB = { objectFit: 'cover', objectPosition: 'right bottom', height: '100%', position: 'absolute', bottom: 0, right: '25%', opacity: 0.2, transition: 'width 0.5s ease-in 0.01s, opacity 0.5s ease-in 0.01s' };
const initStyleLB = { objectFit: 'cover', objectPosition: 'left bottom', height: '100%', position: 'absolute', bottom: 0, left: '25%', opacity: 0.2, transition: 'width 0.5s ease-in 0.01s, opacity 0.5s ease-in 0.01s' };
const initStyleRP = { objectFit: 'cover', objectPosition: 'right bottom', height: '100%', position: 'absolute', bottom: 0, right: '25%',filter: 'hue-rotate(180deg) sepia(100%)', transition: 'width 0.5s ease-in 0.01s, filter 0.5s ease-in 0.01s' };
const initStyleLP = { objectFit: 'cover', objectPosition: 'left bottom', height: '100%', position: 'absolute', bottom: 0, left: '25%',filter: 'hue-rotate(180deg) sepia(100%)', transition: 'width 0.5s ease-in 0.01s, filter 0.5s ease-in 0.01s' };
const initStyleRF = { objectFit: 'cover', objectPosition: 'right bottom', height: '100%', position: 'absolute', bottom: 0, right: '25%', transition: 'width 0.5s ease-in 0s, right 0.5s ease-in-out 0.01s' };
const initStyleLF = { objectFit: 'cover', objectPosition: 'left bottom', height: '100%', position: 'absolute', bottom: 0, left: '25%', transition: 'width 0.5s ease-in 0s, left 0.5s ease-in-out 0.01s' };


function MainHero({ className, images, centerOffsetPercent = 0 }) {
  const relocateImages = (pointerX) => {
    const frameWidth = frameRef?.current?.clientWidth;
    if (!frameWidth) return;
    const displayedDimensionsLB = calculateDisplayDimensions(sizeLB, frameWidth);
    const displayedDimensionsRB = calculateDisplayDimensions(sizeRB, frameWidth);
    const displayedDimensionsLP = calculateDisplayDimensions(sizeLP, frameWidth);
    const displayedDimensionsRP = calculateDisplayDimensions(sizeRP, frameWidth);
    const displayedDimensionsLF = calculateDisplayDimensions(sizeLF, frameWidth);
    const displayedDimensionsRF = calculateDisplayDimensions(sizeRF, frameWidth);
    const adjustedCenter = frameWidth / 2 - (frameWidth / 100 * centerOffsetPercent);
    const x = pointerX ?? adjustedCenter;
    const blinkLFWidth = Math.min(Math.max(0, ((displayedDimensionsLF.width / 2) - (x - (frameWidth / 2)))), displayedDimensionsLF.width);
    // const offsetFrontX = (adjustedCenter  - x) * offsetFrontRatio;
    const offsetFrontX = ((displayedDimensionsLF.width / 2) - blinkLFWidth) * offsetFrontRatio;
    const offsetParallaxX = ((displayedDimensionsLF.width / 2) - blinkLFWidth) * offsetParallaxRatio;
    setStyleLF(prev => {
      return {
        ...prev,
        left: ((frameWidth / 2) - (displayedDimensionsLF.width / 2)) - offsetFrontX + 'px',
        width: blinkLFWidth + 'px',
      }
    });
    setStyleRF(prev => {
      return {
        ...prev,
        right: ((frameWidth / 2) - (displayedDimensionsRF.width / 2)) + offsetFrontX + 'px',
        width: (displayedDimensionsRF.width - blinkLFWidth) + 'px',
      }
    });

    if (sizeLP?.width) {
      setStyleLP(prev => {
        return {
          ...prev,
          left: ((frameWidth / 2) - (displayedDimensionsLP.width / 2)) - offsetParallaxX + 'px',
          filter: (offsetFrontX + effectParallaxOffset)<0 ? '' : initStyleLP.filter,
          // width: blinkLFWidth + (displayedDimensionsLP.width - displayedDimensionsLF.width) + 'px',
        }
      })
    };
    if (sizeRP?.width) {
      setStyleRP(prev => {
        return {
          ...prev,
          // right: ((frameWidth / 2) - (displayedDimensionsRP.width / 2)) + 'px',
          filter: (offsetFrontX -effectParallaxOffset) >0 ? '' : initStyleRP.filter,
          // width: (displayedDimensionsRP.width - blinkLFWidth + (displayedDimensionsLP.width - displayedDimensionsLF.width)) + 'px',
        }
      })
    };

    if (sizeLB?.width) {
      setStyleLB(prev => {
        return {
          ...prev,
          left: ((frameWidth / 2) - (displayedDimensionsLP.width / 2)) + 'px',
          opacity: (offsetFrontX + effectParallaxOffset)<0 ? 1 : initStyleRB.opacity,
          // width: blinkLFWidth + (displayedDimensionsLP.width - displayedDimensionsLF.width) + 'px',
        }
      })
    };
    if (sizeRB?.width) {
      setStyleRB(prev => {
        return {
          ...prev,
          // right: ((frameWidth / 2) - (displayedDimensionsRP.width / 2)) + 'px',
          opacity: (offsetFrontX -effectParallaxOffset) >0 ? 1 : initStyleRB.opacity,
          // width: (displayedDimensionsRP.width - blinkLFWidth + (displayedDimensionsLP.width - displayedDimensionsLF.width)) + 'px',
        }
      })
    };
  }
  // #region style hooks
  const frameRef = React.useRef(null);
  const {width: watcherWidth, height:watcherHeight} = useResizeObserver({
    // watchEntirePage: true,
    elementRef:frameRef,
  });
  const [styleLB, setStyleLB] = React.useState(initStyleLB);
  const [styleRB, setStyleRB] = React.useState(initStyleRB);
  const [styleLP, setStyleLP] = React.useState(initStyleLP);
  const [styleRP, setStyleRP] = React.useState(initStyleRP);
  const [styleLF, setStyleLF] = React.useState(initStyleLF);
  const [styleRF, setStyleRF] = React.useState(initStyleRF);

  const [sizeLB, { loadingLB, errorLB }] = useImageSize(images.srcBackgroundLeft);
  const [sizeRB, { loadingRB, errorRB }] = useImageSize(images.srcBackgroundRight);
  const [sizeLP, { loadingLP, errorLP }] = useImageSize(images.srcParallaxLeft);
  const [sizeRP, { loadingRP, errorRP }] = useImageSize(images.srcParallaxRight);
  const [sizeLF, { loadingLF, errorLF }] = useImageSize(images.srcForegroundLeft);
  const [sizeRF, { loadingRF, errorRF }] = useImageSize(images.srcForegroundRight);

  // #endregion

  // Observe for mount/unmount of MainHero component
  React.useEffect(() => {
    if (!frameRef.current) return;
    if (!sizeLF?.width && !sizeRF?.width) return; // Nothing calculate and apply effects without a front images

    relocateImages(null);
    const handleMouseMove = (event) => {
      relocateImages(event.clientX)
    };
    const handleMouseLeave = () => {
      relocateImages(null);
    }

    frameRef.current.addEventListener('mousemove', handleMouseMove, true);
    frameRef.current.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      frameRef.current.removeEventListener('mousemove', handleMouseMove, true);
    };
  }, [frameRef, sizeLF, sizeRF, sizeLP, sizeRP]);

  React.useEffect(() => {
    relocateImages(null);
  }, [ watcherWidth, watcherHeight])
  return (
    // <MainHeroGroupContext.Provider value={null}>
    <div className={className ?? ''}
      style={initStyleFrame}
      ref={frameRef}
    >
      <div style={{ position: 'relative', height: '100%' }}>
        <img style={styleRB} src={images.srcBackgroundRight} alt=''></img>
        <img style={styleLB} src={images.srcBackgroundLeft} alt=''></img>
        <img style={styleRP} src={images.srcParallaxRight} alt=''></img>
        <img style={styleLP} src={images.srcParallaxLeft} alt=''></img>
        <img style={styleRF} src={images.srcForegroundRight} alt=''></img>
        <img style={styleLF} src={images.srcForegroundLeft} alt=''></img>
      </div>
    </div>
    // </MainHeroGroupContext.Provider>
  );
}


export default MainHero;