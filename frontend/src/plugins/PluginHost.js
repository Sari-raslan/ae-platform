export class PluginHost {

  constructor(){

    this.plugins = [];
  }

  register(plugin){

    this.plugins.push(plugin);
  }
}
