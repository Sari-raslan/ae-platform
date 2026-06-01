export class YamahaStyleParser {
  constructor() {
    this.loadedStyle = null;
  }

  async parseFile(file) {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const text = this.bytesToText(bytes);

    const style = {
      id: crypto.randomUUID(),
      name: file.name,
      format: "YAMAHA_STYLE",
      size: bytes.length,
      detectedChunks: this.detectChunks(text),
      sections: this.extractSections(text),
      parsedAt: new Date().toISOString()
    };

    this.loadedStyle = style;
    return style;
  }

  bytesToText(bytes) {
    let output = "";

    for (let i = 0; i < bytes.length; i++) {
      const c = bytes[i];
      if (c >= 32 && c <= 126) {
        output += String.fromCharCode(c);
      } else {
        output += ".";
      }
    }

    return output;
  }

  detectChunks(text) {
    const known = [
      "MThd",
      "MTrk",
      "CASM",
      "SFF1",
      "SFF2",
      "MAIN A",
      "MAIN B",
      "MAIN C",
      "MAIN D",
      "INTRO A",
      "INTRO B",
      "ENDING A",
      "ENDING B",
      "FILL IN AA",
      "FILL IN BB"
    ];

    return known
      .filter((name) => text.includes(name))
      .map((name) => ({
        name,
        found: true
      }));
  }

  extractSections(text) {
    const possible = [
      "INTRO A",
      "INTRO B",
      "MAIN A",
      "MAIN B",
      "MAIN C",
      "MAIN D",
      "FILL IN AA",
      "FILL IN BB",
      "ENDING A",
      "ENDING B"
    ];

    const sections = {};

    possible.forEach((name) => {
      if (text.includes(name)) {
        sections[name] = {
          name,
          tracks: {
            drums: [],
            bass: [],
            chord: []
          },
          detected: true
        };
      }
    });

    if (Object.keys(sections).length === 0) {
      sections["MAIN A"] = {
        name: "MAIN A",
        tracks: {
          drums: [36, 42, 38, 42],
          bass: [36, 43, 48, 43],
          chord: [48, 52, 55, 52]
        },
        detected: false,
        fallback: true
      };
    }

    return sections;
  }

  status() {
    return this.loadedStyle;
  }
}

export const yamahaStyleParser = new YamahaStyleParser();
