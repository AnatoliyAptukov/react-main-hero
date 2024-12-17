export type MainHeroImages = {
  srcBackLeft: string | null;
  srcBackRight: string | null;
  srcParallaxLeft: string | null;
  srcParallaxRight: string | null;
  srcFrontLeft: string | null;
  srcFrontRight: string | null;
};
export type MainHeroOptions = {
  maxHeight: number;
  aspectRatio: number;
  offsetFrontRatio: number;
  offsetParallaxRatio: number;
  effectParallaxShift: number;
  startBackOpacity: number;
  centerOffsetPercent: number;
};
export type MainHeroProps = {
  className?: string;
  images: MainHeroImages;
  options?: Partial<MainHeroOptions>;
};
export function MainHero(props: MainHeroProps): JSX.Element;
