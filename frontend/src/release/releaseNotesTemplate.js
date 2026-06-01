export function createReleaseNotesTemplate() {
  const notes = {
    version: "v1.0.0",
    date: new Date().toISOString().split("T")[0],
    status: "final",
    
    highlights: [
      "Complete MIDI input/output support",
      "Live keyboard performance with split zones",
      "Real-time chord detection (8 chord types)",
      "Multi-section style engine (INTRO, VAR, FILL, ENDING)",
      "Chord transposition for dynamic style playback",
      "Desktop application (Electron)",
      "Progressive Web App (PWA) support",
      "Service worker for offline functionality",
      "Professional audio engine",
      "Sample loading and playback"
    ],

    phases: [
      "v0.3 — MIDI Foundation: Input/output, device detection",
      "v0.4 — Live Performance Runtime: Keyboard split, chord detection",
      "v0.5 — Style Runtime: Sections, phrase playback, transposition",
      "v0.6 — Sample Engine: WAV/MP3 loading, playback control",
      "v0.7 — PWA Runtime: Service worker, manifest, offline mode",
      "v0.8 — Audio Engine: WebAudio integration, effects",
      "v0.9 — Desktop Packaging: Electron, native builds",
      "v1.0 — Official Release: Stabilization complete"
    ],

    features: {
      MIDI: [
        "✓ Real-time MIDI input from keyboard/controller",
        "✓ MIDI output to external instruments",
        "✓ Device detection and routing",
        "✓ Velocity sensitivity",
        "✓ Note on/off handling"
      ],
      Performance: [
        "✓ Keyboard split (left/right hand zones)",
        "✓ Left-hand chord detection (8 types)",
        "✓ Right-hand lead playback",
        "✓ Tempo control (40-240 BPM)",
        "✓ Transpose and octave controls"
      ],
      Styles: [
        "✓ INTRO, VAR1, VAR2, FILL, ENDING sections",
        "✓ Multi-track playback (DRUMS, BASS, ACC1)",
        "✓ Real-time chord transposition",
        "✓ Bar-quantized section switching",
        "✓ 16-step grid quantization"
      ],
      Audio: [
        "✓ WebAudio API integration",
        "✓ Sample loading (WAV, MP3)",
        "✓ Real-time DSP effects",
        "✓ Master volume control",
        "✓ Individual track mixing"
      ],
      Platform: [
        "✓ Desktop app (Windows, macOS, Linux)",
        "✓ PWA with offline support",
        "✓ Service worker caching",
        "✓ Install-to-home-screen",
        "✓ Cross-platform compatibility"
      ]
    },

    knownLimitations: [
      "Sample library limited to bundled assets",
      "Max 8 simultaneous MIDI devices",
      "Audio latency ~50ms (browser limitation)",
      "Desktop builds require separate signing per platform",
      "PWA install varies by browser/OS"
    ],

    compatibility: {
      OS: ["Windows 10+", "macOS 10.13+", "Ubuntu 18.04+", "iOS 13+", "Android 9+"],
      Browsers: ["Chrome 90+", "Firefox 88+", "Safari 14+", "Edge 90+"],
      MIDI: ["USB MIDI keyboards", "5-pin DIN controllers", "Bluetooth MIDI (on supported OS)"]
    },

    installation: {
      Desktop: "Run installer (.exe, .dmg, .deb, .appimage, or .apk)",
      Web: "Visit https://universal-arranger.app or install PWA",
      Source: "git clone https://github.com/... && npm install && npm run dev"
    },

    changelog: [
      "v1.0.0: Official release with desktop + PWA support",
      "v0.9.0: Desktop packaging and PWA finalization",
      "v0.8.0: WebAudio integration and DSP effects",
      "v0.7.0: Service worker and offline support",
      "v0.6.0: Sample engine and playback control",
      "v0.5.0: Style runtime with chord transposition",
      "v0.4.0: Live performance runtime",
      "v0.3.0: MIDI foundation"
    ],

    support: {
      Documentation: "https://github.com/.../docs",
      Issues: "https://github.com/.../issues",
      Discussions: "https://github.com/.../discussions",
      Twitter: "@UniversalArranger"
    }
  };

  function snapshot() {
    return {
      ok: true,
      ...notes,
      generatedAt: new Date().toISOString()
    };
  }

  function markdown() {
    let md = `# ${notes.version} — Universal Arranger OS\n\n`;
    md += `**Release Date:** ${notes.date}\n\n`;
    md += `**Status:** ${notes.status.toUpperCase()}\n\n`;

    md += `## Highlights\n\n`;
    notes.highlights.forEach(h => { md += `- ${h}\n`; });

    md += `\n## What's Included\n\n`;
    md += `### MIDI\n`;
    notes.features.MIDI.forEach(f => { md += `${f}\n`; });

    md += `\n### Performance\n`;
    notes.features.Performance.forEach(f => { md += `${f}\n`; });

    md += `\n### Styles\n`;
    notes.features.Styles.forEach(f => { md += `${f}\n`; });

    md += `\n### Audio\n`;
    notes.features.Audio.forEach(f => { md += `${f}\n`; });

    md += `\n### Platform Support\n`;
    notes.features.Platform.forEach(f => { md += `${f}\n`; });

    md += `\n## Known Limitations\n\n`;
    notes.knownLimitations.forEach(l => { md += `- ${l}\n`; });

    md += `\n## Installation\n\n`;
    md += `**Desktop:** ${notes.installation.Desktop}\n`;
    md += `**Web:** ${notes.installation.Web}\n`;
    md += `**Source:** \`${notes.installation.Source}\`\n`;

    return md;
  }

  return { snapshot, markdown };
}
