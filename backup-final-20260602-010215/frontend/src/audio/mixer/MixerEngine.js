export class MixerEngine {

  constructor(){

    this.channels = [];
  }

  createChannel(name){

    this.channels.push({
      name,
      volume:1
    });
  }
}
