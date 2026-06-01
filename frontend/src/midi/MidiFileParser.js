export class MidiFileParser {
  constructor() {
    this.file = null;
    this.events = [];
    this.header = null;
  }

  async parse(file) {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    this.file = {
      name: file.name,
      size: bytes.length
    };

    this.events = [];
    this.header = this.parseHeader(bytes);

    this.scanEvents(bytes);

    return this.status();
  }

  readText(bytes, offset, length) {
    return Array.from(bytes.slice(offset, offset + length))
      .map((b) => String.fromCharCode(b))
      .join("");
  }

  read32(bytes, offset) {
    return (
      (bytes[offset] << 24) |
      (bytes[offset + 1] << 16) |
      (bytes[offset + 2] << 8) |
      bytes[offset + 3]
    ) >>> 0;
  }

  read16(bytes, offset) {
    return (bytes[offset] << 8) | bytes[offset + 1];
  }

  parseHeader(bytes) {
    const headerIndex = this.findChunk(bytes, "MThd");

    if (headerIndex < 0) {
      return {
        found: false,
        format: null,
        tracks: 0,
        division: 480
      };
    }

    return {
      found: true,
      length: this.read32(bytes, headerIndex + 4),
      format: this.read16(bytes, headerIndex + 8),
      tracks: this.read16(bytes, headerIndex + 10),
      division: this.read16(bytes, headerIndex + 12)
    };
  }

  findChunk(bytes, name, start = 0) {
    for (let i = start; i < bytes.length - 4; i++) {
      if (this.readText(bytes, i, 4) === name) {
        return i;
      }
    }

    return -1;
  }

  readVarLen(bytes, offset) {
    let value = 0;
    let i = offset;
    let b;

    do {
      b = bytes[i++];
      value = (value << 7) + (b & 0x7f);
    } while (b & 0x80);

    return {
      value,
      next: i
    };
  }

  scanEvents(bytes) {
    let offset = 0;
    let trackIndex = 0;

    while (true) {
      const trackStart = this.findChunk(bytes, "MTrk", offset);
      if (trackStart < 0) break;

      const length = this.read32(bytes, trackStart + 4);
      const end = trackStart + 8 + length;

      this.parseTrack(bytes, trackStart + 8, end, trackIndex);

      offset = end;
      trackIndex++;
    }
  }

  parseTrack(bytes, start, end, trackIndex) {
    let offset = start;
    let time = 0;
    let runningStatus = null;

    while (offset < end) {
      const delta = this.readVarLen(bytes, offset);
      time += delta.value;
      offset = delta.next;

      let status = bytes[offset++];

      if (status < 0x80) {
        offset--;
        status = runningStatus;
      } else {
        runningStatus = status;
      }

      if (!status) break;

      const command = status & 0xf0;
      const channel = (status & 0x0f) + 1;

      if (command === 0x90 || command === 0x80) {
        const note = bytes[offset++];
        const velocity = bytes[offset++];

        this.events.push({
          track: trackIndex,
          time,
          type: command === 0x90 && velocity > 0 ? "noteOn" : "noteOff",
          channel,
          note,
          velocity
        });

        continue;
      }

      if (command === 0xb0) {
        const controller = bytes[offset++];
        const value = bytes[offset++];

        this.events.push({
          track: trackIndex,
          time,
          type: "cc",
          channel,
          controller,
          value
        });

        continue;
      }

      if (command === 0xc0 || command === 0xd0) {
        offset += 1;
        continue;
      }

      if (command === 0xa0 || command === 0xe0) {
        offset += 2;
        continue;
      }

      if (status === 0xff) {
        const metaType = bytes[offset++];
        const len = this.readVarLen(bytes, offset);
        offset = len.next + len.value;

        this.events.push({
          track: trackIndex,
          time,
          type: "meta",
          metaType,
          length: len.value
        });

        continue;
      }

      if (status === 0xf0 || status === 0xf7) {
        const len = this.readVarLen(bytes, offset);
        offset = len.next + len.value;
        continue;
      }

      break;
    }
  }

  getPlayableEvents() {
    return this.events.filter((e) => e.type === "noteOn" || e.type === "noteOff");
  }

  status() {
    return {
      file: this.file,
      header: this.header,
      totalEvents: this.events.length,
      playableEvents: this.getPlayableEvents().length,
      events: this.events.slice(0, 200)
    };
  }
}

export const midiFileParser = new MidiFileParser();
