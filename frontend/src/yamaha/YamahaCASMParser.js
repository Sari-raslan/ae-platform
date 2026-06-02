export class YamahaCASMParser {
  constructor() {
    this.result = null;
  }

  async parseFile(file) {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const text = this.ascii(bytes);

    const casmOffset = text.indexOf("CASM");
    const mthdOffset = text.indexOf("MThd");
    const mtrkCount = this.count(text, "MTrk");

    const sections = this.detectSections(text);
    const tracks = this.detectTracks(text);

    this.result = {
      fileName: file.name,
      size: bytes.length,
      format: "YAMAHA_STYLE",
      midiHeaderFound: mthdOffset >= 0,
      casmFound: casmOffset >= 0,
      casmOffset,
      midiTrackCount: mtrkCount,
      sections,
      tracks,
      parsedAt: new Date().toISOString()
    };

    return this.result;
  }

  ascii(bytes) {
    let out = "";
    for (let i = 0; i < bytes.length; i++) {
      const c = bytes[i];
      out += c >= 32 && c <= 126 ? String.fromCharCode(c) : ".";
    }
    return out;
  }

  count(text, token) {
    let n = 0;
    let pos = 0;
    while ((pos = text.indexOf(token, pos)) >= 0) {
      n++;
      pos += token.length;
    }
    return n;
  }

  detectSections(text) {
    const names = [
      "INTRO A","INTRO B","INTRO C",
      "MAIN A","MAIN B","MAIN C","MAIN D",
      "FILL IN AA","FILL IN BB","FILL IN CC","FILL IN DD",
      "BREAK",
      "ENDING A","ENDING B","ENDING C"
    ];

    return names
      .filter((name) => text.includes(name))
      .map((name) => ({
        name,
        detected: true
      }));
  }

  detectTracks(text) {
    const names = [
      "RHY1","RHY2","BASS","CHD1","CHD2","PAD","PHR1","PHR2",
      "DRUM","PERC","ACC1","ACC2","ACC3","ACC4","ACC5"
    ];

    return names
      .filter((name) => text.includes(name))
      .map((name) => ({
        name,
        role: this.role(name)
      }));
  }

  role(name) {
    if (["RHY1","RHY2","DRUM","PERC"].includes(name)) return "drums";
    if (name === "BASS") return "bass";
    if (["CHD1","CHD2","ACC1","ACC2"].includes(name)) return "chord";
    if (name === "PAD") return "pad";
    if (["PHR1","PHR2","ACC3","ACC4","ACC5"].includes(name)) return "phrase";
    return "unknown";
  }

  exportNormalized() {
    if (!this.result) return null;

    return {
      version: "10.0.0",
      source: this.result.fileName,
      format: this.result.format,
      casm: {
        found: this.result.casmFound,
        offset: this.result.casmOffset
      },
      midi: {
        headerFound: this.result.midiHeaderFound,
        tracks: this.result.midiTrackCount
      },
      sections: this.result.sections,
      tracks: this.result.tracks,
      exportedAt: new Date().toISOString()
    };
  }
}

export const yamahaCASMParser = new YamahaCASMParser();
