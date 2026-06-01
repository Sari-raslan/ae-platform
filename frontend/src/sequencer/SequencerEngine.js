export class SequencerEngine {

  constructor(){

    this.timeline = [];
  }

  addEvent(event){

    this.timeline.push(event);
  }
}
