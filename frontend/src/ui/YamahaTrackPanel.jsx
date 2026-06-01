import { useEffect,useState } from "react";
import { yamahaTrackEngine } from "../yamaha/YamahaTrackEngine";

const chords = [
  "C","Dm","Em","F","G","Am","B"
];

const sections = [
  "MAIN_A",
  "MAIN_B"
];

export default function YamahaTrackPanel() {

  const [status,setStatus] =
    useState(
      yamahaTrackEngine.status()
    );

  const [events,setEvents] =
    useState([]);

  useEffect(() => {

    const off =
      yamahaTrackEngine.on((e) => {

        setEvents(old =>
          [e,...old].slice(0,30)
        );

        setStatus(
          yamahaTrackEngine.status()
        );

      });

    const timer =
      setInterval(() => {

        setStatus(
          yamahaTrackEngine.status()
        );

      },300);

    return () => {

      off();

      clearInterval(timer);

    };

  },[]);

  return (
    <section className="panel">

      <h2>
        Real Yamaha Track Playback
      </h2>

      <div className="toolbar">

        <button
          onClick={() =>
            yamahaTrackEngine.start()
          }
        >
          Start
        </button>

        <button
          onClick={() =>
            yamahaTrackEngine.stop()
          }
        >
          Stop
        </button>

      </div>

      <div className="grid">

        <div className="box">

          <h3>Status</h3>

          <p>
            Running:
            {String(status.running)}
          </p>

          <p>
            Tempo:
            {status.tempo}
          </p>

          <p>
            Section:
            {status.section}
          </p>

          <p>
            Chord:
            {status.chord}
          </p>

          <p>
            Step:
            {status.step}
          </p>

          <label>Tempo</label>

          <input
            type="range"
            min="70"
            max="180"
            value={status.tempo}
            onChange={(e) => {

              yamahaTrackEngine.setTempo(
                e.target.value
              );

              setStatus(
                yamahaTrackEngine.status()
              );

            }}
          />

        </div>

        <div className="box">

          <h3>Sections</h3>

          <div className="keys">

            {sections.map(sec => (

              <button
                key={sec}
                onClick={() =>
                  yamahaTrackEngine.setSection(sec)
                }
              >
                {sec}
              </button>

            ))}

          </div>

          <h3>Chords</h3>

          <div className="keys">

            {chords.map(ch => (

              <button
                key={ch}
                onClick={() =>
                  yamahaTrackEngine.setChord(ch)
                }
              >
                {ch}
              </button>

            ))}

          </div>

        </div>

      </div>

      <div className="box">

        <h3>Runtime Events</h3>

        <pre>
{events.map(e =>
`${e.type} ${JSON.stringify(e.data)}`
).join("\n")}
        </pre>

      </div>

    </section>
  );

}
