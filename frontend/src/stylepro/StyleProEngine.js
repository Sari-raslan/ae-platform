export class StyleProEngine {
  constructor() {
    this.loadedStyle = null;
    this.midiRoutes = [];
    this.sampleLibrary = JSON.parse(localStorage.getItem("uaos_sample_library") || "[]");
  }

  async parseStyleFile(file) {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const text = this.ascii(bytes);

    const format = this.detectFormat(file.name, text);

    this.loadedStyle = {
      id: crypto.randomUUID(),
      name: file.name,
      size: bytes.length,
      format,
      markers: {
        midiHeader: text.includes("MThd"),
        tracks: this.count(text, "MTrk"),
        casm: text.includes("CASM"),
        sff1: text.includes("SFF1"),
        sff2: text.includes("SFF2"),
        korg: text.includes("KORG")
      },
      sections: this.detectSections(text, format),
      tracks: this.detectTracks(text),
      parsedAt: new Date().toISOString()
    };

    return this.loadedStyle;
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

  detectFormat(name, text) {
    const lower = name.toLowerCase();

    if (text.includes("CASM") || text.includes("SFF1") || text.includes("SFF2")) {
      return "YAMAHA_STYLE";
    }

    if (text.includes("KORG") || lower.endsWith(".stl")) {
      return "KORG_STYLE";
    }

    if (text.includes("MThd") && text.includes("MTrk")) {
      return "MIDI_STYLE";
    }

    return "UNKNOWN_STYLE";
  }

  detectSections(text, format) {
    const yamaha = [
      "INTRO A", "INTRO B", "INTRO C",
      "MAIN A", "MAIN B", "MAIN C", "MAIN D",
      "FILL IN AA", "FILL IN BB", "FILL IN CC", "FILL IN DD",
      "BREAK",
      "ENDING A", "ENDING B", "ENDING C"
    ];

    const korg = [
      "INTRO1", "INTRO2", "INTRO3",
      "VAR1", "VAR2", "VAR3", "VAR4",
      "FILL1", "FILL2", "FILL3", "FILL4",
      "BREAK",
      "ENDING1", "ENDING2", "ENDING3"
    ];

    const list = format === "KORG_STYLE" ? korg : [...yamaha, ...korg];

    return list
      .filter((x) => text.includes(x))
      .map((name) => ({
        name,
        detected: true
      }));
  }

  detectTracks(text) {
    const tracks = [
      "RHY1", "RHY2", "BASS", "CHD1", "CHD2", "PAD", "PHR1", "PHR2",
      "DRUM", "PERC", "ACC1", "ACC2", "ACC3", "ACC4", "ACC5"
    ];

    return tracks
      .filter((x) => text.includes(x))
      .map((name) => ({
        name,
        role: this.trackRole(name),
        enabled: true,
        output: "internal"
      }));
  }

  trackRole(name) {
    if (["RHY1", "RHY2", "DRUM", "PERC"].includes(name)) return "drums";
    if (name === "BASS") return "bass";
    if (["CHD1", "CHD2", "ACC1", "ACC2"].includes(name)) return "chord";
    if (name === "PAD") return "pad";
    if (["PHR1", "PHR2", "ACC3", "ACC4", "ACC5"].includes(name)) return "phrase";
    return "unknown";
  }

  addMidiRoute(input = "All Inputs", channel = 1, target = "Arranger") {
    const route = {
      id: crypto.randomUUID(),
      input,
      channel: Number(channel),
      target,
      enabled: true,
      createdAt: new Date().toISOString()
    };

    this.midiRoutes.push(route);
    return route;
  }

  removeMidiRoute(id) {
    this.midiRoutes = this.midiRoutes.filter((r) => r.id !== id);
  }

  addSampleToLibrary(fileName, category = "User", rootNote = 60) {
    const item = {
      id: crypto.randomUUID(),
      fileName,
      category,
      rootNote: Number(rootNote),
      createdAt: new Date().toISOString()
    };

    this.sampleLibrary.unshift(item);
    localStorage.setItem("uaos_sample_library", JSON.stringify(this.sampleLibrary));

    return item;
  }

  removeSample(id) {
    this.sampleLibrary = this.sampleLibrary.filter((x) => x.id !== id);
    localStorage.setItem("uaos_sample_library", JSON.stringify(this.sampleLibrary));
  }

  exportProjectData() {
    return {
      version: "10.1.0",
      style: this.loadedStyle,
      midiRoutes: this.midiRoutes,
      sampleLibrary: this.sampleLibrary,
      exportedAt: new Date().toISOString()
    };
  }

  status() {
    return {
      loadedStyle: this.loadedStyle,
      midiRoutes: this.midiRoutes,
      sampleLibrary: this.sampleLibrary
    };
  }
}

export const styleProEngine = new StyleProEngine();
