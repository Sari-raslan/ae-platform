export const factoryStyles = {
  pop8beat: {
    id: "pop8beat",
    name: "Pop 8 Beat",
    tempo: 110,
    sections: {
      INTRO1: [48, 52, 55, 60],
      VAR1: [48, 55, 60, 55, 52, 55, 60, 55],
      VAR2: [48, 55, 64, 67, 60, 64, 67, 64],
      FILL1: [48, 50, 52, 53, 55, 57, 59, 60],
      ENDING1: [60, 55, 52, 48]
    }
  },

  ballad: {
    id: "ballad",
    name: "Slow Ballad",
    tempo: 72,
    sections: {
      INTRO1: [48, 55, 60],
      VAR1: [48, 60, 55, 60],
      VAR2: [48, 52, 55, 60, 64, 60],
      FILL1: [55, 57, 59, 60],
      ENDING1: [60, 55, 48]
    }
  },

  dance: {
    id: "dance",
    name: "Dance Beat",
    tempo: 128,
    sections: {
      INTRO1: [36, 48, 55, 60],
      VAR1: [36, 48, 36, 55, 36, 60, 36, 55],
      VAR2: [36, 48, 55, 64, 36, 60, 67, 64],
      FILL1: [36, 38, 40, 43, 45, 47, 48],
      ENDING1: [60, 55, 48, 36]
    }
  }
};
