export class LivePerformanceEngine {
  constructor() {
    this.scenes = [
      {
        id: "scene-1",
        name: "Opening",
        style: "Pop Intro",
        tempo: 110,
        section: "INTRO",
        chord: "C"
      },
      {
        id: "scene-2",
        name: "Main Groove",
        style: "Pop Main",
        tempo: 112,
        section: "MAIN_A",
        chord: "C"
      },
      {
        id: "scene-3",
        name: "Variation",
        style: "Pop Variation",
        tempo: 116,
        section: "MAIN_B",
        chord: "G"
      },
      {
        id: "scene-4",
        name: "Bridge",
        style: "Soft Bridge",
        tempo: 96,
        section: "MAIN_C",
        chord: "Am"
      },
      {
        id: "scene-5",
        name: "Ending",
        style: "Final Ending",
        tempo: 90,
        section: "ENDING",
        chord: "C"
      }
    ];

    this.currentScene = this.scenes[0];
    this.running = false;
    this.step = 0;
    this.timer = null;
    this.listeners = [];
    this.log = [];
  }

  on(cb) {
    this.listeners.push(cb);

    return () => {
      this.listeners = this.listeners.filter((x) => x !== cb);
    };
  }

  emit(type, data = {}) {
    const event = {
      type,
      data,
      time: new Date().toISOString()
    };

    this.log.unshift(event);
    this.log = this.log.slice(0, 50);

    this.listeners.forEach((cb) => cb(event));
  }

  setScene(id) {
    const scene = this.scenes.find((s) => s.id === id);
    if (!scene) return;

    this.currentScene = scene;
    this.step = 0;

    this.emit("scene:change", {
      scene
    });
  }

  nextScene() {
    const index = this.scenes.findIndex((s) => s.id === this.currentScene.id);
    const next = this.scenes[(index + 1) % this.scenes.length];
    this.setScene(next.id);
  }

  previousScene() {
    const index = this.scenes.findIndex((s) => s.id === this.currentScene.id);
    const prev = this.scenes[(index - 1 + this.scenes.length) % this.scenes.length];
    this.setScene(prev.id);
  }

  setSection(section) {
    this.currentScene = {
      ...this.currentScene,
      section
    };

    this.emit("section:change", {
      section
    });
  }

  setChord(chord) {
    this.currentScene = {
      ...this.currentScene,
      chord
    };

    this.emit("chord:change", {
      chord
    });
  }

  setTempo(tempo) {
    this.currentScene = {
      ...this.currentScene,
      tempo: Number(tempo)
    };

    if (this.running) {
      this.start();
    }

    this.emit("tempo:change", {
      tempo: Number(tempo)
    });
  }

  start() {
    this.stop();

    this.running = true;

    const interval = 60000 / this.currentScene.tempo / 2;

    this.timer = setInterval(() => {
      this.step++;

      this.emit("performance:tick", {
        scene: this.currentScene,
        step: this.step
      });
    }, interval);

    this.emit("performance:start", {
      scene: this.currentScene
    });
  }

  stop() {
    if (this.timer) clearInterval(this.timer);

    this.timer = null;
    this.running = false;

    this.emit("performance:stop", {
      scene: this.currentScene
    });
  }

  panic() {
    this.stop();

    this.emit("panic", {
      message: "All notes off / performance stopped"
    });
  }

  addScene(name = "New Scene") {
    const scene = {
      id: crypto.randomUUID(),
      name,
      style: "Custom Style",
      tempo: 110,
      section: "MAIN_A",
      chord: "C"
    };

    this.scenes.push(scene);

    this.emit("scene:add", {
      scene
    });

    return scene;
  }

  removeScene(id) {
    this.scenes = this.scenes.filter((s) => s.id !== id);

    if (this.currentScene.id === id) {
      this.currentScene = this.scenes[0] || null;
    }

    this.emit("scene:remove", {
      id
    });
  }

  exportSetlist() {
    return {
      version: "2.2.0",
      scenes: this.scenes,
      currentScene: this.currentScene,
      exportedAt: new Date().toISOString()
    };
  }

  importSetlist(data) {
    if (data?.scenes?.length) {
      this.scenes = data.scenes;
      this.currentScene = data.currentScene || data.scenes[0];

      this.emit("setlist:import", {
        scenes: this.scenes.length
      });
    }
  }

  status() {
    return {
      running: this.running,
      step: this.step,
      currentScene: this.currentScene,
      scenes: this.scenes,
      log: this.log
    };
  }
}

export const livePerformance = new LivePerformanceEngine();
