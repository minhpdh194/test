import { cn } from "@/lib/utils";
import { home } from "@/referential/i18nPrefixes";
import { userProfileStore } from "@/store/user-store";
import { SpotType } from "@/types/SpotType";
import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";

export default function UserGameDetails({
  className, data, ...props
}: { data: SpotType[], className: string }) {
  const user = userProfileStore();

  const { t } = useTranslation();

  const [timeLeftNextFixing, setTimeLeftNextFixing] = useState(0);
  // const [timeLeftPeriodEnd, setTimeLeftPeriodEnd] = useState(0);
  const [intervalIdNextFixing, setIntervalIdNextFixing] = useState<NodeJS.Timeout | null>(null);
  // const [intervalIdPeriodEnd, setIntervalIdPeriodEnd] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (data && data.length > 0) {
      // Calculate time to next fixing (2 minutes)
      const currentTime = Date.now();
      const nextFixingTime = Math.ceil(currentTime / 120000) * 120000; // Round up to the nearest 2 minutes
      const timeRemainingNextFixing = Math.max(0, Math.floor((nextFixingTime - currentTime) / 1000));
      setTimeLeftNextFixing(timeRemainingNextFixing);

      // Calculate time to next period end (6 hours)
      const nextPeriodEndTime = new Date(currentTime);
      const hoursToNextPeriodEnd = (6 - (nextPeriodEndTime.getHours() % 6)) % 6;
      nextPeriodEndTime.setHours(nextPeriodEndTime.getHours() + hoursToNextPeriodEnd);
      nextPeriodEndTime.setMinutes(0);
      nextPeriodEndTime.setSeconds(0);
      nextPeriodEndTime.setMilliseconds(0);

      // const timeRemainingPeriodEnd = Math.max(0, Math.floor((nextPeriodEndTime.getTime() - currentTime) / 1000));
      // setTimeLeftPeriodEnd(timeRemainingPeriodEnd);

      // Clear existing intervals
      if (intervalIdNextFixing) {
        clearInterval(intervalIdNextFixing);
      }
      // if (intervalIdPeriodEnd) {
      //   clearInterval(intervalIdPeriodEnd);
      // }

      // Set up interval for next fixing countdown
      const newIntervalIdNextFixing = setInterval(() => {
        setTimeLeftNextFixing((prevTime) => {
          if (prevTime <= 15) {
            isPositionOpenable = false;
          } else {
            isPositionOpenable = true;
          }
          if (prevTime <= 1) {
            clearInterval(newIntervalIdNextFixing);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      setIntervalIdNextFixing(newIntervalIdNextFixing);

      // Set up interval for period end countdown
      // const newIntervalIdPeriodEnd = setInterval(() => {
      //   setTimeLeftPeriodEnd((prevTime) => {
      //     if (prevTime <= 1) {
      //       clearInterval(newIntervalIdPeriodEnd);
      //       return 0;
      //     }
      //     return prevTime - 1;
      //   });
      // }, 1000);
      // setIntervalIdPeriodEnd(newIntervalIdPeriodEnd);

      return () => {
        clearInterval(newIntervalIdNextFixing);
        // clearInterval(newIntervalIdPeriodEnd);
      };
    }
  }, [data]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // const formatTimePeriod = (seconds: number): string => {
  //   const hours = Math.floor(seconds / 3600);
  //   const minutes = Math.floor((seconds % 3600) / 60);
  //   const secs = seconds % 60;
  //   return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  // };

  return (
    <div
      className={cn("flex items-stretch justify-between gap-2", className)}
      {...props}
    >
      <div className="flex flex-col items-center justify-center flex-1 p-2 select-none rounded-xl z-10" style={{ backgroundColor: `#32363C` }}>
        <p className="mb-1 text-xs font-medium text-center" style={{ color: `#F79841` }}>{t(`${home}.earn_per_tap`)}</p>
        <div className="inline-flex items-center space-x-1.5 text-white font-bold">
          <img className="object-contain w-5 h-5" src="/images/home/coin.png" />{" "}
          <span className="text-sm">+{user?.earn_per_tap}</span>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center flex-1 p-2 select-none rounded-xl z-10" style={{ backgroundColor: `#32363C` }}>
        <p className="mb-1 text-xs font-medium text-center" style={{ color: `#6F72E2` }}>{t(`${home}.time_to_next_fixing`)}</p>
        <div className="inline-flex items-center space-x-1.5 text-gradient font-bold">
          <img className="object-contain w-5 h-5" src="/images/home/clock.png" />
          <span className={`text-sm ${!isPositionOpenable && "text-red-400"}`}>
            {formatTime(timeLeftNextFixing)}
          </span>
        </div>
      </div>
      {/* <div className="flex flex-col items-center justify-center flex-1 p-2 select-none rounded-xl z-10" style={{ backgroundColor: `#32363C` }}>
        <p className="mb-1 text-xs font-medium text-center" style={{ color: `#84CB69` }}>Time to period end</p>
        <div className="inline-flex items-center space-x-1.5 text-white font-bold">
          <img className="object-contain w-5 h-5" src="/images/home/clock.png" />
          <span className="text-sm">
            {formatTimePeriod(timeLeftPeriodEnd)}
          </span>
        </div>
      </div> */}
    </div>
  );
}
