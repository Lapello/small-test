import * as PIXI from 'pixi.js';
import _ from 'lodash';

import ComponentBase from './base';

export default class ComponentFireParticles extends ComponentBase {

  private particles:Particle[] = [];
  private emitter:PIXI.Sprite = new PIXI.Sprite();

  private particleLimit:number = 10;

  constructor(protected app:PIXI.Application) {
    super(app);
    this.init();
  }

  public start = () => {
    this.app.stage.addChild(this);
    this.app.ticker.add(this.updateParticles);
  }

  public stop = () => {
    this.app.stage.removeChild(this);
    this.app.ticker.remove(this.updateParticles);
    this.reset();
  }

  private init = () => {
    this.emitter.x = this.app.renderer.width/2;
    this.emitter.y = this.app.renderer.height/2;
    this.addChild(this.emitter);

    for (let i = 0; i < this.particleLimit; i++) {
      let particle:Particle = new Particle(i * 5);
      this.particles.push(particle);
      this.emitter.addChild(particle);
    }
  }

  private updateParticles = () => {
    _.each(this.particles, particle => {
      particle.update();
    });
  }

  private reset = () => {
    _.each(this.particles, particle => {
      particle.reset();
    });
  }
}

class Particle extends PIXI.Graphics {

  private delayLeft:number = 0;
  private ySpeed:number = Math.random() * 2 + 2;
  private brightness:number = 0.5;

  constructor(private delay:number) {
    super();

    this.delayLeft = delay;
    this.redraw();
    this.x = Math.random() * 10 - 5;
    this.alpha = 0;
  }

  public update = () => {
    if (this.delayLeft > 0) {
      this.delayLeft--;
      return;
    }
    
    this.alpha = 1;
    this.y -= this.ySpeed;
    this.scale.x -= 0.02;
    this.scale.y -= 0.02;

    if (this.brightness < 1) {
      this.brightness += 0.02;
    }

    if (this.scale.x <= 0.1) {
      this.y = 0;
      this.ySpeed = Math.random() * 2 + 2;
      this.scale.set(1);
      this.x = Math.random() * 10 - 5;
      this.brightness = 0.5;
    }

    this.redraw();
  }

  public reset = () => {
    this.delayLeft = this.delay;
    this.y = 0;
    this.x = Math.random() * 10 - 5;
    this.scale.set(1);
    this.alpha = 0;
    this.brightness = 0.5;
  }

  private redraw = () => {
    this.clear();
    this.beginFill(0xFFCC00, this.brightness);
    this.lineStyle(20, 0xFFDD00, 1.2 - this.brightness);
    this.drawCircle(0, 0, 25);
  }
}