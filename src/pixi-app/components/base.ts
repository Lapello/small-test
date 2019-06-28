import * as PIXI from 'pixi.js';
import _ from 'lodash';

export default class ComponentBase extends PIXI.Sprite {

  protected assets = {};

  constructor(protected app:PIXI.Application) {
    super();
  }

  public getAssetList = ():string[] => {
    return _.each(Object.values(this.assets));
  }
  
  public start = () => {
    this.app.stage.addChild(this);
  }

  public stop = () => {
    this.app.stage.removeChild(this);
  }
}