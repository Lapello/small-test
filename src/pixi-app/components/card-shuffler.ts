import * as PIXI from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';
import _ from 'lodash';

import ComponentBase from './base';

export default class ComponentCardShuffler extends ComponentBase {

  protected assets = {
    PIKACHU   :   './assets/pikachucard.png'
  }

  private leftPoint:PIXI.Point;       // Left target spot for cards
  private rightPoint:PIXI.Point;      // Right target spot for cards
  private cards:PIXI.Sprite[] = [];
  private indexer:number = 144;       // Determines which card is currently moving
  private fpsCounter:PIXI.Text;

  constructor(protected app:PIXI.Application) {
    super(app);
    this.init();
  }

  public start = () => {
    this.app.stage.addChild(this);
    this.loopCards();
    this.app.ticker.add(this.updateFPS);
  }

  public stop = () => {
    this.app.stage.removeChild(this);
    TWEEN.removeAll();
    this.reset();
    this.app.ticker.remove(this.updateFPS);
  }

  private init = () => {
    this.leftPoint = new PIXI.Point(this.app.renderer.width/2 - 200, this.app.renderer.height/2);
    this.rightPoint = new PIXI.Point(this.app.renderer.width/2 + 200, this.app.renderer.height/2);

    for (let i = 0; i < 144; i++) {
      let card:PIXI.Sprite = new PIXI.Sprite(PIXI.Texture.from(this.assets.PIKACHU));
      card.anchor.set(0.5);
      card.scale.set(0.8);
      card.x = this.leftPoint.x + i * 1;
      card.y = this.leftPoint.y + i * 1;
      this.cards.push(card);
      this.addChild(card);
    }

    this.fpsCounter = new PIXI.Text('FPS: 999', {
      fontFamily: 'arial',
      fontSize: 40,
      fontWeight: 'bold',
      fill: 0xFFFFFF
    });
    this.addChild(this.fpsCounter);
  }

  private updateFPS = () => {
    this.fpsCounter.text = 'FPS: ' + this.app.ticker.FPS.toFixed(0);
  }

  private loopCards = () => {
    this.indexer--;
    if (this.indexer < 0) {
      this.reset();
      this.indexer = 143;
    }
    this.addChild(this.cards[this.indexer]);

    new TWEEN.Tween(this.cards[this.indexer]).to({x: this.rightPoint.x + 144 - this.indexer, y: this.rightPoint.y + 144 - this.indexer}, 2000).easing(TWEEN.Easing.Sinusoidal.Out).start();
    new TWEEN.Tween().delay(1000).start().onComplete(this.loopCards);
  }

  private reset = () => {
    this.indexer = 144;
    for (let i = 0; i < 144; i++) {
      this.cards[i].x = this.leftPoint.x + i * 1;
      this.cards[i].y = this.leftPoint.y + i * 1;
      this.addChild(this.cards[i]);
    }
  }
}