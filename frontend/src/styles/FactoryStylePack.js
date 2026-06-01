export const factoryStylePack = {
  yamahaPop: {
    id: "yamaha-pop-demo",
    format: "YAMAHA_STYLE_LIKE",
    name: "Yamaha Pop Demo",
    tempo: 112,
    timeSignature: "4/4",
    sections: {
      INTRO_A: {
        bars: 2,
        tracks: {
          drums: [36, 38, 42, 36, 42, 38, 46, 42],
          bass: [36, 36, 43, 43, 48, 43, 36, 43],
          chord1: [48, 52, 55, 52, 48, 52, 55, 52]
        }
      },
      MAIN_A: {
        bars: 4,
        tracks: {
          drums: [36, 42, 38, 42, 36, 42, 38, 46],
          bass: [36, 36, 43, 43, 48, 48, 43, 43],
          chord1: [48, 52, 55, 60, 55, 52, 48, 52]
        }
      },
      MAIN_B: {
        bars: 4,
        tracks: {
          drums: [36, 42, 38, 46, 36, 42, 38, 46],
          bass: [36, 43, 48, 55, 48, 43, 36, 43],
          chord1: [48, 55, 60, 64, 60, 55, 52, 55]
        }
      },
      FILL_A: {
        bars: 1,
        tracks: {
          drums: [38, 38, 40, 41, 43, 45, 47, 48],
          bass: [36, 38, 40, 41, 43, 45, 47, 48],
          chord1: [48, 50, 52, 53, 55, 57, 59, 60]
        }
      },
      ENDING_A: {
        bars: 2,
        tracks: {
          drums: [36, 42, 38, 42, 36],
          bass: [48, 43, 40, 36],
          chord1: [60, 55, 52, 48]
        }
      }
    }
  },

  korgOriental: {
    id: "korg-oriental-demo",
    format: "KORG_STYLE_LIKE",
    name: "KORG Oriental Demo",
    tempo: 96,
    timeSignature: "4/4",
    sections: {
      INTRO_A: {
        bars: 2,
        tracks: {
          drums: [36, 42, 38, 42, 36, 46, 38, 42],
          bass: [36, 37, 43, 48, 43, 37, 36, 43],
          chord1: [48, 49, 52, 55, 60, 55, 52, 49]
        }
      },
      VAR_1: {
        bars: 4,
        tracks: {
          drums: [36, 42, 38, 42, 36, 42, 38, 46],
          bass: [36, 43, 37, 43, 48, 43, 37, 43],
          chord1: [48, 49, 52, 55, 52, 49, 48, 49]
        }
      },
      VAR_2: {
        bars: 4,
        tracks: {
          drums: [36, 42, 38, 46, 36, 42, 38, 46],
          bass: [36, 37, 43, 48, 55, 48, 43, 37],
          chord1: [48, 52, 55, 61, 60, 55, 52, 49]
        }
      },
      FILL_1: {
        bars: 1,
        tracks: {
          drums: [38, 40, 41, 43, 45, 47, 48],
          bass: [36, 37, 39, 40, 43, 45, 48],
          chord1: [48, 49, 51, 52, 55, 57, 60]
        }
      },
      ENDING_1: {
        bars: 2,
        tracks: {
          drums: [36, 42, 38, 36],
          bass: [48, 43, 37, 36],
          chord1: [60, 55, 52, 49, 48]
        }
      }
    }
  }
};
