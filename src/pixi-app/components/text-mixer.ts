import * as PIXI from 'pixi.js';
import _ from 'lodash';

import ComponentBase from './base';

export default class ComponentTextMixer extends ComponentBase {

  protected assets = {
    MONEY     :   '/assets/fakeImg1.png',
    POKEMON   :   '/assets/fakeImg2.png'
  }

  private textArea:PIXI.Sprite = new PIXI.Sprite();
  private midPoint:PIXI.Point;

  private elapsedTime:number = 0;
  private maxObjects:number = 3;     // Max number of objects in a line (Ex: Image + Text + Image)

  constructor(protected app:PIXI.Application) {
    super(app);
    this.init();
  }

  public start = () => {
    this.app.stage.addChild(this);
    this.app.ticker.add(this.updateMixer);
    this.randomiseText();
  }

  public stop = () => {
    this.app.stage.removeChild(this);
    this.app.ticker.remove(this.updateMixer);
    this.reset();
  }

  private init = () => {
    this.midPoint = new PIXI.Point(this.app.renderer.width/2, this.app.renderer.height/2);
    this.textArea.y = this.midPoint.y;
    this.addChild(this.textArea);
  }

  private updateMixer = () => {
    this.elapsedTime += this.app.ticker.elapsedMS;

    // If 2 seconds elapse, randomize text
    if (this.elapsedTime >= 2000) {
      this.elapsedTime = 0;
      this.randomiseText();
    }
  }

  private randomiseText = () => {
    this.textArea.removeChildren();

    for (let i = 0; i < this.maxObjects; i++) {
      let textOrImage:number = Math.random() * 2 - 1;

      // If its bigger than 0, use random image, otherwise make text
      if (textOrImage > 0) {
        let image:PIXI.Sprite = new PIXI.Sprite(PIXI.Texture.from(Object.values(this.assets)[Math.floor(Math.random() * Object.values(this.assets).length)]));
        image.anchor.set(0, 0.5);
        image.x = this.textArea.getBounds().width;
        this.textArea.addChild(image);
      } else {
        let output:string = Math.floor(Math.random() * 100000 + 50000).toString();
        let text:PIXI.Text = new PIXI.Text(output, {
          fontFamily: 'arial',
          fontSize: Math.random() * 40 + 10,
          fill: 0xFFFFFF
        });
        text.x = this.textArea.getBounds().width;
        text.y = -text.getBounds().height/2;
        this.textArea.addChild(text);
      }
    }

    this.textArea.x = this.midPoint.x - this.textArea.getBounds().width/2;
  }

  private reset = () => {
    this.textArea.removeChildren();
    this.elapsedTime = 0;
  }
}