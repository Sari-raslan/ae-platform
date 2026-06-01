import { WebMidi } from "webmidi";

export class MidiEngine {

  async initialize(){

    await WebMidi.enable();

    console.log("MIDI READY");

    console.log(WebMidi.inputs);
  }
}
