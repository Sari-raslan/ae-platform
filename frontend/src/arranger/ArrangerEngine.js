export class ArrangerEngine {

  constructor(){

    this.currentStyle = null;
  }

  loadStyle(style){

    this.currentStyle = style;

    console.log("STYLE LOADED");
  }
}
