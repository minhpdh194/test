import React from 'react';
import ProgressBar from './components/ProgressBar';

interface SplashScreenProps {
  picNb: number;
  progress: number;
}

const url = (picNb: number):string => {
  switch (picNb) {
    case 1:
      return "/images/splash-screen/pic__1.webp";
    case 2:
      return "/images/splash-screen/pic__2.webp";
    case 3:
      return "/images/splash-screen/pic__3.webp";
    case 4:
      return "/images/splash-screen/pic__4.webp";
    case 5:
      return "/images/splash-screen/pic__5.webp";
    case 6:
      return "/images/splash-screen/pic__6.webp";
    case 7:
      return "/images/splash-screen/pic__7.webp";
    case 8:
      return "/images/splash-screen/pic__8.webp";
    case 9:
      return "/images/splash-screen/pic__9.webp";
    case 10:
      return "/images/splash-screen/pic__10.webp";
    case 11:
      return "/images/splash-screen/pic__11.webp";
    case 12:
      return "/images/splash-screen/pic__12.webp";
    case 13:
      return "/images/splash-screen/pic__13.webp";
    case 14:
      return "/images/splash-screen/pic__14.webp";
    default:
      return "/images/splash-screen/pic__1.webp";
  };
}

const SplashScreen: React.FC<SplashScreenProps> = ({ picNb, progress }) => {

  return (
    <div className="relative flex flex-col justify-end pt-16 bg-cover bg-center w-full max-w-lg h-[--tg-viewport-height] mx-auto">
      <img src={url(picNb)} alt="Splash Image" className="absolute inset-0 w-full h-full object-cover -z-10" loading="eager" />
      <div className="flex mt-4 flex-col items-center w-full">
          <div className="row w-100 flex justify-center mb-10">
            <div className="col-10">
              <div className="progress w-100">
                <ProgressBar value={progress} max={100} />
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default SplashScreen;
