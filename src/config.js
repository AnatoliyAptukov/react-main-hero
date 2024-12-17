export const defaultOptions = {
  maxHeight: 600,
  aspectRatio: 900 / 600,
  offsetFrontRatio: 1 / 5,
  offsetParallaxRatio: 1 / 20,
  effectParallaxShift: 10,
  startBackOpacity: 0.1,
  centerOffsetPercent: 0,
};

export const defaultStyles = {
  frame: {
    overflowX: 'clip',
  },
  backRight: {
    objectFit: 'cover',
    objectPosition: 'right bottom',
    height: '100%',
    position: 'absolute',
    bottom: 0,
    right: '25%',
    transition: 'width 0.5s ease-in 0.01s, opacity 0.5s ease-in 0.01s',
  },
  backLeft: {
    objectFit: 'cover',
    objectPosition: 'left bottom',
    height: '100%',
    position: 'absolute',
    bottom: 0,
    left: '25%',
    transition: 'width 0.5s ease-in 0.01s, opacity 0.5s ease-in 0.01s',
  },
  parallaxRight: {
    objectFit: 'cover',
    objectPosition: 'right bottom',
    height: '100%',
    position: 'absolute',
    bottom: 0,
    right: '25%',
    filter: 'hue-rotate(180deg) sepia(100%)',
    transition:
      'width 0.5s ease-in 0.01s, right 0.5s ease-in-out 0.01s, filter 0.5s ease-in 0.01s',
  },
  parallaxLeft: {
    objectFit: 'cover',
    objectPosition: 'left bottom',
    height: '100%',
    position: 'absolute',
    bottom: 0,
    left: '25%',
    filter: 'hue-rotate(180deg) sepia(100%)',
    transition:
      'width 0.5s ease-in 0.01s, left 0.5s ease-in-out 0.01s, filter 0.5s ease-in 0.01s',
  },
  frontRight: {
    objectFit: 'cover',
    objectPosition: 'right bottom',
    height: '100%',
    position: 'absolute',
    bottom: 0,
    right: '25%',
    transition: 'width 0.5s ease-in 0s, right 0.5s ease-in-out 0.01s',
  },
  frontLeft: {
    objectFit: 'cover',
    objectPosition: 'left bottom',
    height: '100%',
    position: 'absolute',
    bottom: 0,
    left: '25%',
    transition: 'width 0.5s ease-in 0s, left 0.5s ease-in-out 0.01s',
  },
};
