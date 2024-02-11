import React, { useState } from "react";
import axios from "axios";
import ProgressBar from "./ProgressBar";

function WebPlayer() {
  const [songData, setSongData] = useState({
    duration: null,
    artists: null,
    imageSrc: "",
  });
  const [playAudioFiles, setPlayAudioFiles] = useState([]);
  const [filesList, setFilesList] = useState([]);
  const [audioFile, setAudioFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState({
    song: null,
    play: false,
  });
  const handleFileSelect = async (files) => {
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("audioFile", file);
        const response = await axios.post(
          "http://localhost:8000/get-metadata",
          formData
        );
        setFilesList((prev) => [...prev, response.data]);
      }
    } catch (error) {
      console.error("Error retrieving metadata:", error.message);
    } finally {
      console.log("Set the Data");
    }
  };
  const handleDirectorySelect = async (event) => {
    const files = event.target.files;
    setPlayAudioFiles(files);
    if (files.length > 0) {
      const fileList = Array.from(files).map((file) => file);
      await handleFileSelect(fileList);
    }
  };

  const playAudio = async (aFile, src, artists, duration) => {
    console.log(aFile);
    setSongData({
      ...songData,
      duration: duration,
      artists: artists.map((e) => e).join(", "),
      imageSrc: src,
      name: aFile.name.split(".")[0],
    });
    if (isPlaying.play) {
      audioFile.pause();
    }
    const audio = new Audio(URL.createObjectURL(aFile));
    setAudioFile(audio);
    audio.play();
    setIsPlaying({
      song: audio,
      play: true,
    });
  };
  const pauseSong = () => {
    if (isPlaying.play) audioFile.pause();
  };
  const playSong = () => {
    audioFile.play();
  };
  return (
    <div className="w-full">
      <div className="w-full px-8 py-2">
        <div className="flex gap-2 border-2 border-violet-500 rounded-md">
          <h2 className="m-auto uppercase tracking-wider">
            Select a Directory
          </h2>
          <div className="m-auto py-4">
            <input
              type="file"
              id="directoryInput"
              directory=""
              webkitdirectory=""
              onChange={handleDirectorySelect}
            />
          </div>
        </div>
      </div>
      <div className="flex w-full">
        <div className="flex-1 p-4 flex flex-col gap-2 justify-center">
          <div
            className={`w-full ${
              songData.imageSrc ? `h-full` : `h-[30rem]`
            } bg-red-50`}
          >
            {songData.imageSrc && (
              <img className="w-full" src={songData.imageSrc} alt="" />
            )}
          </div>
          <div>
            {songData.duration && <ProgressBar duration={songData.duration} />}
          </div>
          <div className="mt-4 capitalize">
            {songData.name && <p> {songData.name} </p>}
          </div>
          <div className="">
            {songData.artists && <p>{songData.artists}</p>}
          </div>
          <div className="flex gap-2 m-auto">
            <button onClick={playSong}>Play</button>
            <button onClick={pauseSong}>Pause</button>
          </div>
        </div>
        <div className="flex-1">
          {filesList.length > 0 && (
            <div className="w-full p-4">
              <h3 className="text-xl">
                Files <small>({filesList.length})</small>
              </h3>
              <ul className="flex flex-col gap-y-2">
                {filesList.map((file, index) => {
                  const blob = new Blob(
                    [Int8Array.from(file.common.picture[0].data.data)],
                    {
                      type: file.common.picture[0].data.type,
                    }
                  );
                  const src = window.URL.createObjectURL(blob);
                  return (
                    <div
                      className="w-full flex gap-2 cursor-pointer rounded-md custom-bg p-2 capitalize"
                      key={index}
                      onClick={() =>
                        playAudio(
                          playAudioFiles[index],
                          src,
                          file.common.artists,
                          file.format.duration
                        )
                      }
                    >
                      <div className="flex h-full flex-col">
                        <img
                          className="h-12 w-12 rounded-sm"
                          src={src}
                          alt=""
                        />
                      </div>
                      <div className="w-full flex flex-col">
                        <div>{file.common.title}</div>
                        <div>
                          {file.common.artists.map((e) => e).join(", ")}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WebPlayer;
