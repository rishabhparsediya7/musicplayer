import React, { useState } from "react";
import song from "../assets/files/ramsiyaram.mp3";
function MusicPlayer() {
  const [audio] = useState(new Audio(song));
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
    </div>
  );
}

export default MusicPlayer;
