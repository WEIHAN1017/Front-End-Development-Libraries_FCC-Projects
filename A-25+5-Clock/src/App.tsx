import { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"Session" | "Break">("Session");

  const intervalRef = useRef<number | null>(null);
  const beepRef = useRef<HTMLAudioElement | null>(null);

  // 讽 timeLeft 笷 0 冀ち传家Α砞计计
  useEffect(() => {
    if (timeLeft !== 0) return;

    if (beepRef.current) {
      beepRef.current.currentTime = 0;
      beepRef.current.play();
    }

    if (mode === "Session") {
      setMode("Break");
      setTimeLeft(breakLength * 60);
    } else {
      setMode("Session");
      setTimeLeft(sessionLength * 60);
    }
  }, [timeLeft, mode, breakLength, sessionLength]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const mm = minutes.toString().padStart(2, "0");
    const ss = seconds.toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const handleStartStop = () => {
    if (isRunning) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsRunning(false);
    } else {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => (prev > 0 ? prev - 1 : prev));
      }, 1000);
      setIsRunning(true);
    }
  };

  const resetTimer = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setIsRunning(false);
    setMode("Session");
    if (beepRef.current) {
      beepRef.current.pause();
      beepRef.current.currentTime = 0;
    }
  };

  const handleBreakChange = (amount: number) => {
    setBreakLength(prev => {
      const next = prev + amount;
      return next > 0 && next <= 60 ? next : prev;
    });
  };

  const handleSessionChange = (amount: number) => {
    setSessionLength(prev => {
      const next = prev + amount;
      if (next > 0 && next <= 60) {
        if (!isRunning) {
          setTimeLeft(next * 60);
        }
        return next;
      }
      return prev;
    });
  };

  return (
    <div className="App">
      <h1>25 + 5 Clock</h1>

      <div id="break-label">
        Break Length
        <div>
          <button id="break-decrement" onClick={() => handleBreakChange(-1)}>
            -
          </button>
          <span id="break-length">{breakLength}</span>
          <button id="break-increment" onClick={() => handleBreakChange(1)}>
            +
          </button>
        </div>
      </div>

      <div id="session-label">
        Session Length
        <div>
          <button
            id="session-decrement"
            onClick={() => handleSessionChange(-1)}
          >
            -
          </button>
          <span id="session-length">{sessionLength}</span>
          <button
            id="session-increment"
            onClick={() => handleSessionChange(1)}
          >
            +
          </button>
        </div>
      </div>

      <div id="timer-label">{mode}</div>
      <div id="time-left">{formatTime(timeLeft)}</div>

      <button id="start_stop" onClick={handleStartStop}>
        Start / Stop
      </button>
      <button id="reset" onClick={resetTimer}>
        Reset
      </button>

      <audio
        id="beep"
        ref={beepRef}
        src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
        preload="auto"
      />
    </div>
  );
}

export default App;