import * as PIXI from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';
import _ from 'lodash';

import ComponentBase from './components/base';
import ComponentCardShuffler from './components/card-shuffler';
import ComponentTextMixer from './components/text-mixer';
import ComponentFireParticles from './components/fire-particles';
import ComponentMenuSelector from './components/menu-selector';

export default class PIXI_APP {

  private app:PIXI.Application;
  private components:ComponentBase[] = [];

  constructor(width:number, height:number) {
    // Load the pixi app using the window's boundaries
    this.app = new PIXI.Application({
      width: width,
      height: height,
      backgroundColor: 0x1099bb,
      resolution: window.devicePixelRatio || 1
    });

    // Initiate each component
    this.components.push(new ComponentMenuSelector(this.app, this.changeComponent));
    this.components.push(new ComponentCardShuffler(this.app));
    this.components.push(new ComponentTextMixer(this.app));
    this.components.push(new ComponentFireParticles(this.app));

    // Load all assets before use
    this.loadAssets();

    // Update Loop
    this.app.ticker.add(this.update);
  }

  public getView = () => {
    return this.app.view;
  }

  private update = () => {
    // @tweenjs/tween.js is a good Tweening engine! :)
    TWEEN.update(this.app.ticker.lastTime);
  }

  private loadAssets = () => {
    _.each(this.components, component => {
      this.app.loader.add(component.getAssetList());
    });

    this.app.loader.load();

    // Once complete load the selection menu
    this.app.loader.onComplete.add(() => {
      this.app.loader.reset();
      this.changeComponent(0);
    });
  }

  private changeComponent = (index:number) => {
    // Stop all components and launch the selected one
    _.each(this.components, component => {
      component.stop();
    });
    this.components[index].start();
  }
}