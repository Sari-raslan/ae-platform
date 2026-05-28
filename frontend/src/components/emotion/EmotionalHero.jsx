export default function EmotionalHero() {

  return (
    <div className="emotion-hero">

      <div className="emotion-glow"></div>

      <div className="music-notes">
        <span>♫</span>
        <span>♬</span>
        <span>♪</span>
        <span>♩</span>
        <span>♫</span>
      </div>

      <div className="emotion-content">

        <div className="emotion-left">

          <h1>
            Keyboard Manager
          </h1>

          <p>
            Professional Arranger Workstation
          </p>

          <div className="emotion-buttons">

            <button className="music-btn">
              ♫ Open Library
            </button>

            <button className="music-btn secondary">
              ♬ Live MIDI
            </button>

          </div>

        </div>

        <div className="emotion-right">

          <div className="piano-wrapper">

            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className={i % 2 === 0 ? "white-key" : "black-key"}
              />
            ))}

          </div>

          <div className="equalizer">

            {Array.from({ length: 60 }).map((_, i) => (
              <div
                key={i}
                className="eq-bar"
                style={{
                  height: `${20 + ((i * 17) % 140)}px`
                }}
              />
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}
