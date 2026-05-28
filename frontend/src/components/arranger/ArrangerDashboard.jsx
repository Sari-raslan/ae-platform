import { useEffect, useState } from "react";

export default function ArrangerDashboard(){

  const [styles,setStyles] = useState([]);

  useEffect(()=>{
    fetch("http://localhost:4000/api/arranger/styles")
      .then(r=>r.json())
      .then(data=>{
        setStyles(data.styles || []);
      })
      .catch(()=>{});
  },[]);

  return (
    <div className="arranger-panel">

      <div className="arranger-header">
        <h2>♫ Live Arranger Engine</h2>
        <p>Realtime professional keyboard workstation</p>
      </div>

      <div className="arranger-grid">

        {styles.map(style => (

          <div
            key={style.id}
            className="arranger-card"
          >

            <div className="arranger-top">
              <span className="arranger-icon">
                ♬
              </span>

              <span className="arranger-bpm">
                {style.bpm} BPM
              </span>
            </div>

            <h3>{style.name}</h3>

            <p>{style.mood}</p>

            <button className="arranger-btn">
              ▶ Preview
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}
