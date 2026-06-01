import * as Tone from "tone";

export class AudioEngine {

  async initialize(){

    await Tone.start();

    console.log("AUDIO READY");
  }
}
