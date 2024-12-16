import React, { useReducer, useEffect, useRef, useCallback } from 'react';
import { useImageSize } from 'react-image-size';
import { useResizeObserver } from 'react-ext-hooks';
import { defaultOptions, defaultStyles } from './config';

function MainHero({ className, images, options }) {
  options = { ...defaultOptions, ...options };
  const initStyles = getInitStyles(options);
  const sizes = useImageSizes(images);
  const frameRef = useRef(null);
  const [styles, dispatchStyles] = useReducer(styleReducer, initStyles);
  const { width: watcherWidth, height: watcherHeight } = useResizeObserver({
    elementRef: frameRef,
  });

  const relocateImages = useCallback(
    (pointerX) => {
      const frameWidth = frameRef?.current?.clientWidth;
      if (!frameWidth) return;
      const currentStyles = calculateStyles(
        frameWidth,
        pointerX,
        options,
        sizes,
        initStyles
      );
      dispatchStyles(currentStyles);
    },
    [images, options]
  );

  useEffect(() => {
    if (
      !frameRef.current ||
      (!sizes?.frontLeft?.width && !sizes?.frontRight?.width)
    )
      return; // Nothing calculate and apply effects without a front images
    relocateImages(null);
    const handleMouseMove = (event) => {
      relocateImages(event.clientX);
    };
    const handleMouseLeave = () => {
      relocateImages(null);
    };

    frameRef.current.addEventListener('mousemove', handleMouseMove, true);
    frameRef.current.addEventListener('mouseleave', handleMouseLeave);
    return /*Remove listeners func*/ () => {
      frameRef.current.removeEventListener('mousemove', handleMouseMove, true);
    };
  }, [
    frameRef,
    sizes?.frontLeft,
    sizes?.frontRight,
    sizes?.parallaxLeft,
    sizes?.parallaxRight,
    watcherWidth,
    watcherHeight,
  ]);

  return (
    <div
      className={'react-main-hero__frame' + '' + (className ?? '')}
      style={initStyles.frame}
      ref={frameRef}
    >
      <div style={{ position: 'relative', height: '100%' }}>
        <img
          className={'react-main-hero__back-right'}
          style={styles.backRight}
          src={images.srcBackRight}
          alt=""
        ></img>
        <img
          className={'react-main-hero__back-left'}
          style={styles.backLeft}
          src={images.srcBackLeft}
          alt=""
        ></img>
        <img
          className={'react-main-hero__parallax-right'}
          style={styles.parallaxRight}
          src={images.srcParallaxRight}
          alt=""
        ></img>
        <img
          className={'react-main-hero__parallax-left'}
          style={styles.parallaxLeft}
          src={images.srcParallaxLeft}
          alt=""
        ></img>
        <img
          className={'react-main-hero__front-right'}
          style={styles.frontRight}
          src={images.srcFrontRight}
          alt=""
        ></img>
        <img
          className={'react-main-hero__front-left'}
          style={styles.frontLeft}
          src={images.srcFrontLeft}
          alt=""
        ></img>
      </div>
    </div>
  );
}

function useImageSizes(images) {
  const [backLeft] = useImageSize(images.srcBackLeft);
  const [backRight] = useImageSize(images.srcBackRight);
  const [parallaxLeft] = useImageSize(images.srcParallaxLeft);
  const [parallaxRight] = useImageSize(images.srcParallaxRight);
  const [frontLeft] = useImageSize(images.srcFrontLeft);
  const [frontRight] = useImageSize(images.srcFrontRight);
  const sizes = {
    backLeft,
    backRight,
    parallaxLeft,
    parallaxRight,
    frontLeft,
    frontRight,
  };
  return sizes;
}

function styleReducer(state, action) {
  let newState = { ...state };
  if (action.backLeft)
    newState = {
      ...newState,
      backLeft: { ...state.backLeft, ...action.backLeft },
    };
  if (action.backRight)
    newState = {
      ...newState,
      backRight: { ...state.backRight, ...action.backRight },
    };
  if (action.parallaxLeft)
    newState = {
      ...newState,
      parallaxLeft: { ...state.parallaxLeft, ...action.parallaxLeft },
    };
  if (action.parallaxRight)
    newState = {
      ...newState,
      parallaxRight: { ...state.parallaxRight, ...action.parallaxRight },
    };
  if (action.frontLeft)
    newState = {
      ...newState,
      frontLeft: { ...state.frontLeft, ...action.frontLeft },
    };
  if (action.frontRight)
    newState = {
      ...newState,
      frontRight: { ...state.frontRight, ...action.frontRight },
    };
  return newState;
}

function calculateStyles(frameWidth, pointerX, options, sizes, initStyles) {
  const displaySizes = getDisplaySizes(sizes, frameWidth, options);

  const adjustedCenter =
    frameWidth / 2 -
    (displaySizes.frontLeft.width / 100) * options.centerOffsetPercent;
  const x = pointerX ?? adjustedCenter;
  // const x = 0;
  const blinkLFWidth = Math.min(
    Math.max(0, displaySizes.frontLeft.width / 2 - (x - frameWidth / 2)),
    displaySizes.frontLeft.width
  );
  const offsetFrontX =
    (displaySizes.frontLeft.width / 2 - blinkLFWidth) *
    options.offsetFrontRatio;
  const offsetParallaxX =
    (displaySizes.frontLeft.width / 2 - blinkLFWidth) *
    options.offsetParallaxRatio;
  const styles = {
    frontLeft: {
      left:
        Math.ceil(
          frameWidth / 2 - displaySizes.frontLeft.width / 2 - offsetFrontX
        ) + 'px',
      width: blinkLFWidth + 'px',
    },
    frontRight: {
      right:
        Math.floor(
          frameWidth / 2 - displaySizes.frontRight.width / 2 + offsetFrontX
        ) + 'px',
      width: displaySizes.frontRight.width - blinkLFWidth + 'px',
    },
    parallaxLeft: sizes?.parallaxLeft?.width
      ? {
          left:
            frameWidth / 2 -
            displaySizes.parallaxLeft.width / 2 -
            offsetParallaxX +
            'px',
          filter:
            offsetFrontX + options.effectParallaxOffset < 0
              ? ''
              : initStyles.parallaxLeft.filter,
        }
      : null,
    parallaxRight: sizes?.parallaxRight?.width
      ? {
          right:
            frameWidth / 2 -
            displaySizes.parallaxRight.width / 2 +
            offsetParallaxX +
            'px',
          filter:
            offsetFrontX - options.effectParallaxOffset > 0
              ? ''
              : initStyles.parallaxRight.filter,
        }
      : null,
    backLeft: sizes?.backLeft?.width
      ? {
          left: frameWidth / 2 - displaySizes.backLeft.width / 2 + 'px',
          opacity:
            offsetFrontX + options.effectParallaxOffset < 0
              ? 1
              : initStyles.backLeft.opacity,
        }
      : null,
    backRight: sizes?.backRight?.width
      ? {
          right: frameWidth / 2 - displaySizes.backRight.width / 2 + 'px',
          opacity:
            offsetFrontX - options.effectParallaxOffset > 0
              ? 1
              : initStyles.backRight.opacity,
        }
      : null,
  };
  return styles;
}

function getInitStyles(options) {
  const frame = {
    ...defaultStyles.frame,
    height: `min(${options.maxHeight}px,calc(100vw / ${options.aspectRatio}))`,
  };
  const backRight = {
    ...defaultStyles.backRight,
    opacity: options.startBackOpacity,
  };
  const backLeft = {
    ...defaultStyles.backLeft,
    opacity: options.startBackOpacity,
  };
  const parallaxRight = {
    ...defaultStyles.parallaxRight,
  };
  const parallaxLeft = {
    ...defaultStyles.parallaxLeft,
  };
  const frontRight = {
    ...defaultStyles.frontRight,
  };
  const frontLeft = {
    ...defaultStyles.frontLeft,
  };
  return {
    frame,
    backRight,
    backLeft,
    parallaxRight,
    parallaxLeft,
    frontRight,
    frontLeft,
  };
}

function getDisplaySizes(sizes, frameWidth, options) {
  const calculate = calculateDisplaySize(frameWidth, options);
  const backLeft = calculate(sizes.backLeft);
  const backRight = calculate(sizes.backRight);
  const parallaxLeft = calculate(sizes.parallaxLeft);
  const parallaxRight = calculate(sizes.parallaxRight);
  const frontLeft = calculate(sizes.frontLeft);
  const frontRight = calculate(sizes.frontRight);
  return {
    backLeft,
    backRight,
    parallaxLeft,
    parallaxRight,
    frontLeft,
    frontRight,
  };
}

function calculateDisplaySize(frameWidth, options) {
  return (imageSize) => {
    let result = { width: 0, height: 0 };
    const width = imageSize?.width;
    const height = imageSize?.height;
    if (!width || !height || !frameWidth) return result;
    const frameHeight = Math.min(
      options.maxHeight,
      frameWidth / options.aspectRatio
    );

    result.height = frameHeight;
    result.width = (frameHeight / height) * width;
    return result;
  };
}

export default MainHero;
