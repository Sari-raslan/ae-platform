export class UniversalStyleParser {
  constructor() {
    this.loaded = null;
  }

  async parseFile(file) {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const text = this.bytesToText(bytes);
    const format = this.detectFormat(file.name, text);

    const style = {
      id: crypto.randomUUID(),
      name: file.name,
      format,
      size: bytes.length,
      chunks: this.detectChunks(text, format),
      sections: this.extractSections(text, format),
      tracks: this.extractTrackMap(text, format),
      metadata: this.extractMetadata(file, bytes, text),
      parsedAt: new Date().toISOString()
    };

    this.loaded = style;
    return style;
  }

  bytesToText(bytes) {
    let out = "";
    for (let i = 0; i < bytes.length; i++) {
      const c = bytes[i];
      out += c >= 32 && c <= 126 ? String.fromCharCode(c) : ".";
    }
    return out;
  }

  detectFormat(name, text) {
    const lower = name.toLowerCase();

    if (
      lower.endsWith(".sty") ||
      lower.endsWith(".prs") ||
      lower.endsWith(".sst") ||
      text.includes("CASM") ||
      text.includes("SFF1") ||
      text.includes("SFF2")
    ) {
      return "YAMAHA_STYLE";
    }

    if (
      lower.endsWith(".stl") ||
      lower.endsWith(".sty") ||
      text.includes("KORG") ||
      text.includes("KORGSTYLE")
    ) {
      return "KORG_STYLE";
    }

    if (text.includes("MThd") && text.includes("MTrk")) {
      return "MIDI_STYLE";
    }

    return "UNKNOWN_STYLE";
  }

  detectChunks(text, format) {
    const common = ["MThd", "MTrk"];
    const yamaha = ["CASM", "SFF1", "SFF2", "MAIN A", "MAIN B", "INTRO A", "ENDING A", "FILL IN"];
    const korg = ["KORG", "KORGSTYLE", "CV1", "CV2", "VAR1", "VAR2", "INTRO1", "ENDING1", "FILL1"];

    const search = format === "YAMAHA_STYLE"
      ? [...common, ...yamaha]
      : format === "KORG_STYLE"
        ? [...common, ...korg]
        : [...common, ...yamaha, ...korg];

    return search
      .filter((x) => text.includes(x))
      .map((x) => ({
        name: x,
        found: true
      }));
  }

  extractSections(text, format) {
    const yamahaSections = [
      "INTRO A",
      "INTRO B",
      "INTRO C",
      "MAIN A",
      "MAIN B",
      "MAIN C",
      "MAIN D",
      "FILL IN AA",
      "FILL IN BB",
      "FILL IN CC",
      "FILL IN DD",
      "BREAK",
      "ENDING A",
      "ENDING B",
      "ENDING C"
    ];

    const korgSections = [
      "INTRO1",
      "INTRO2",
      "INTRO3",
      "VAR1",
      "VAR2",
      "VAR3",
      "VAR4",
      "FILL1",
      "FILL2",
      "FILL3",
      "FILL4",
      "BREAK",
      "ENDING1",
      "ENDING2",
      "ENDING3"
    ];

    const names = format === "YAMAHA_STYLE"
      ? yamahaSections
      : format === "KORG_STYLE"
        ? korgSections
        : [...yamahaSections, ...korgSections];

    const sections = {};

    names.forEach((name) => {
      if (text.includes(name)) {
        sections[name] = this.createSection(name, true);
      }
    });

    if (Object.keys(sections).length === 0) {
      sections["MAIN A"] = this.createSection("MAIN A", false);
      sections["FILL"] = this.createSection("FILL", false);
      sections["ENDING"] = this.createSection("ENDING", false);
    }

    return sections;
  }

  createSection(name, detected) {
    return {
      name,
      detected,
      bars: detected ? 4 : 1,
      tracks: {
        drums: detected ? [] : [36, 42, 38, 42, 36, 42, 38, 46],
        bass: detected ? [] : [36, 36, 43, 43, 48, 48, 43, 43],
        chord1: detected ? [] : [48, 52, 55, 60, 55, 52, 48, 52],
        chord2: detected ? [] : [],
        phrase1: detected ? [] : [],
        phrase2: detected ? [] : []
      }
    };
  }

  extractTrackMap(text, format) {
    const trackNames = [
      "RHY1",
      "RHY2",
      "BASS",
      "CHD1",
      "CHD2",
      "PAD",
      "PHR1",
      "PHR2",
      "DRUM",
      "PERC",
      "ACC1",
      "ACC2",
      "ACC3",
      "ACC4",
      "ACC5"
    ];

    const detected = trackNames.filter((t) => text.includes(t));

    return {
      format,
      detectedTracks: detected,
      defaultMapping: {
        drums: detected.includes("RHY1") || detected.includes("DRUM"),
        percussion: detected.includes("RHY2") || detected.includes("PERC"),
        bass: detected.includes("BASS"),
        chord1: detected.includes("CHD1") || detected.includes("ACC1"),
        chord2: detected.includes("CHD2") || detected.includes("ACC2"),
        pad: detected.includes("PAD"),
        phrase1: detected.includes("PHR1"),
        phrase2: detected.includes("PHR2")
      }
    };
  }

  extractMetadata(file, bytes, text) {
    return {
      fileName: file.name,
      extension: file.name.split(".").pop()?.toLowerCase() || "",
      byteLength: bytes.length,
      hasMidiHeader: text.includes("MThd"),
      hasMidiTracks: text.includes("MTrk"),
      hasCASM: text.includes("CASM"),
      hasSFF1: text.includes("SFF1"),
      hasSFF2: text.includes("SFF2"),
      hasKorgMarker: text.includes("KORG")
    };
  }

  exportNormalizedStyle() {
    if (!this.loaded) return null;

    return {
      version: "3.1.0",
      normalizedAt: new Date().toISOString(),
      source: {
        name: this.loaded.name,
        format: this.loaded.format,
        size: this.loaded.size
      },
      sections: this.loaded.sections,
      tracks: this.loaded.tracks,
      metadata: this.loaded.metadata
    };
  }

  status() {
    return this.loaded;
  }
}

export const universalStyleParser = new UniversalStyleParser();
