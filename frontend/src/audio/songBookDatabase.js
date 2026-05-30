export function createSongBookDatabase() {
  let songs = [
    {
      id: "song-1",
      title: "Demo Pop",
      style: "POP-16BEAT",
      tempo: 120,
      chord: "C major",
      variation: "VAR1",
    },
    {
      id: "song-2",
      title: "Demo Ballad",
      style: "BALLAD",
      tempo: 90,
      chord: "A minor",
      variation: "VAR2",
    },
  ];

  function list() {
    return songs;
  }

  function add(song = {}) {
    const item = {
      id: song.id || `song-${songs.length + 1}`,
      title: song.title || "Untitled",
      style: song.style || "POP",
      tempo: song.tempo || 120,
      chord: song.chord || "C major",
      variation: song.variation || "VAR1",
    };

    songs.push(item);

    return item;
  }

  function snapshot() {
    return {
      ok: true,
      songs,
      count: songs.length,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    list,
    add,
    snapshot,
  };
}
