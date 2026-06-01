export class ArrangerEngine {
  constructor() { this.currentStyle = "Init"; }
  loadStyle(styleName) {
    this.currentStyle = styleName;
    return { ok: true, style: this.currentStyle };
  }
}
