import { useEffect } from "react";
import "./App.css";

interface DrumPad {
  key: string;
  id: string;
  url: string;
}

const drumPads: DrumPad[] = [
  {
    key: "Q",
    id: "Heater-1",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3",
  },
  {
    key: "W",
    id: "Heater-2",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3",
  },
  {
    key: "E",
    id: "Heater-3",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3",
  },
  {
    key: "A",
    id: "Heater-4",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3",
  },
  {
    key: "S",
    id: "Clap",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3",
  },
  {
    key: "D",
    id: "Open-HH",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3",
  },
  {
    key: "Z",
    id: "Kick-n'-Hat",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3",
  },
  {
    key: "X",
    id: "Kick",
    url: "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3",
  },
  {
    key: "C",
    id: "Closed-HH",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3",
  },
];

function App() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const pad = drumPads.find((p) => p.key === e.key.toUpperCase());
      if (pad) {
        const audio = document.getElementById(pad.key) as HTMLAudioElement;
        audio.currentTime = 0;
        audio.play();
        const display = document.getElementById("display");
        if (display) display.innerText = pad.id;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const playSound = (pad: DrumPad) => {
    const audio = document.getElementById(pad.key) as HTMLAudioElement;
    audio.currentTime = 0;
    audio.play();
    const display = document.getElementById("display");
    if (display) display.innerText = pad.id;
  };

  return (
    <div id="drum-machine" className="container">
      <div id="display" className="display">Press a pad</div>
      <div className="pad-grid">
        {drumPads.map((pad) => (
          <div
            key={pad.key}
            className="drum-pad"
            id={pad.id}
            onClick={() => playSound(pad)}
          >
            {pad.key}
            <audio className="clip" id={pad.key} src={pad.url}></audio>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;