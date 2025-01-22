import React from 'react';
import ProgressBar from './components/ProgressBar';

interface SplashScreenProps {
  progress: number;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ progress }) => {
  return (
    <div
      className="flex flex-col justify-end pt-16 bg-[url('/images/splash-screen/bg-splash.png')] bg-cover bg-center w-full max-w-lg h-[--tg-viewport-height] mx-auto"
    >
      <div className="flex mt-4 flex-col items-center w-full">
        <div
          className="flex flex-col items-center w-full bg-cover"
          style={{
            backgroundImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))',
          }}
        >
          <h1 className="text-3xl mt-4 font-bold text-center uppercase px-3 mb-2">
            Reshaping digital Finance
          </h1>
          <div className="flex justify-center">
            <div className="flex-1 mb-4">
              <p className="text-center text-sm">
                visit our website
              </p>
              <p className="text-center fw-bold text-lg">www.one-xmm.com</p>
            </div>
          </div>
          <div className="row w-100 flex justify-center mb-10">
            <div className="col-10">
              <div className="progress w-100">
                <ProgressBar value={progress} max={100} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
