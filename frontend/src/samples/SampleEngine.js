export class SampleEngine {

  constructor(){

    this.samples = {};
  }

  load(name,url){

    this.samples[name] = url;

    console.log("Loaded sample:",name);
  }
}
