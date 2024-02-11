import React, { useState, useEffect } from "react";

function ProgressBar({ duration }) {
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(0);
  const [endDuration, setEndDuration] = useState({
    minutes: "",
    seconds: "",
  });
  const startProgress = (duration) => {
    setCurrent(0);
    const mins = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    setEndDuration({
      minutes: mins.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
    });
    const perSecond = duration / 100;
    const incs = 100 / duration;
    setProgress(0);

    const progressInterval = setInterval(() => {
      setCurrent((prev) => prev + 1);
      setProgress((prevProgress) => {
        const newProgress = prevProgress + incs;
        return newProgress <= 100 ? newProgress : 100;
      });
    }, perSecond * 1000);

    return () => clearInterval(progressInterval);
  };

  useEffect(() => {
    startProgress(duration);
  }, [duration]);
  const formatTime = (time) => {
    if (time >= duration) return;
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="w-full mt-2">
      <div className="h-2 bg-green-400 rounded-md">
        <div
          className={`h-2 bg-green-800 rounded-md`}
          style={{ width: `${progress}%`, transition: "width linear" }}
        ></div>
        <div className="flex justify-between">
          <div>{formatTime(current)}</div>
          {endDuration.minutes && endDuration.seconds && (
            <div>
              {endDuration.minutes}:{endDuration.seconds}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;
