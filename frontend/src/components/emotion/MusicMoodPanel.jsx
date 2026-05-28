export default function MusicMoodPanel() {

  const moods = [
    "Epic",
    "Oriental",
    "Live",
    "Studio",
    "Performance",
    "Dream"
  ];

  return (
    <div className="mood-panel">

      {moods.map((mood, i) => (
        <div key={i} className="mood-card">

          <div className="mood-icon">
            
          </div>

          <strong>{mood}</strong>

        </div>
      ))}

    </div>
  );
}
