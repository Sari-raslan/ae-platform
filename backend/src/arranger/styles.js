export const styles = [
  { id: "oriental-pop", name: "Oriental Pop", bpm: 120, mood: "Epic", family: "Live" },
  { id: "khaleeji", name: "Khaleeji Groove", bpm: 108, mood: "Live", family: "Oriental" },
  { id: "turkish", name: "Turkish Dance", bpm: 132, mood: "Performance", family: "Dance" }
];

export function getStyles() {
  return { ok: true, count: styles.length, styles };
}
