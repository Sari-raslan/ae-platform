import { useEffect, useRef, useState } from "react";
import { midiRecorder } from "../midi/MidiRecorder";

const NOTES = [
  ["C",60],
  ["D",62],
  ["E",64],
  ["F",65],
  ["G",67],
  ["A",69],
  ["B",71],
  ["C2",72]
];

export default function PianoRollPanel() {

  const [status,setStatus] = useState(
    midiRecorder.status()
  );

  const [events,setEvents] = useState([]);

  const audioRef = useRef(null);

  useEffect(() => {

    audioRef.current = new AudioContext();

    const off = midiRecorder.on(() => {

      setStatus(
        midiRecorder.status()
      );

      setEvents([
        ...midiRecorder.events
      ]);

    });

    return () => off();

  }, []);

  function freq(note) {

    return 440 * Math.pow(
      2,
      (note - 69) / 12
    );

  }

  function playSynth(note, duration = 0.25) {

    const ctx = audioRef.current;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.value = freq(note);

    const now = ctx.currentTime;

    gain.gain.setValueAtTime(
      0.12,
      now
    );

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + duration
    );

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);

  }

  function noteOn(note) {

    playSynth(note);

    midiRecorder.noteOn(note,100);

  }

  function noteOff(note) {

    midiRecorder.noteOff(note);

  }

  function playSequence() {

    midiRecorder.play((event) => {

      if (event.type === "noteOn") {

        playSynth(event.note);

      }

    });

  }

  function exportJSON() {

    const data =
      midiRecorder.exportJSON();

    const blob = new Blob(
      [
        JSON.stringify(data,null,2)
      ],
      {
        type:"application/json"
      }
    );

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;
    a.download = "uaos-midi-recording.json";
    a.click();

    URL.revokeObjectURL(url);

  }

  return (
    <section className="panel">

      <h2>Piano Roll + MIDI Recorder</h2>

      <div className="toolbar">

        <button
          onClick={() => midiRecorder.startRecord()}
        >
          Record
        </button>

        <button
          onClick={() => midiRecorder.stopRecord()}
        >
          Stop Record
        </button>

        <button
          onClick={playSequence}
        >
          Play
        </button>

        <button
          onClick={() => midiRecorder.stopPlay()}
        >
          Stop Play
        </button>

        <button
          onClick={() => midiRecorder.clear()}
        >
          Clear
        </button>

        <button
          onClick={exportJSON}
        >
          Export JSON
        </button>

      </div>

      <div className="grid">

        <div className="box">

          <h3>Status</h3>

          <p>
            Recording:
            {String(status.recording)}
          </p>

          <p>
            Playing:
            {String(status.playing)}
          </p>

          <p>
            Events:
            {status.totalEvents}
          </p>

        </div>

        <div className="box">

          <h3>Keyboard</h3>

          <div className="keys">

            {NOTES.map(([name,note]) => (

              <button
                key={note}
                onMouseDown={() => noteOn(note)}
                onMouseUp={() => noteOff(note)}
              >
                {name}
              </button>

            ))}

          </div>

        </div>

      </div>

      <div className="box">

        <h3>Piano Roll Events</h3>

        <pre>
{events.map(e =>
JSON.stringify(e)
).join("\n")}
        </pre>

      </div>

    </section>
  );
}
