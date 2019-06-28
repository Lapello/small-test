import * as PIXI from 'pixi.js';
import _ from 'lodash';

import ComponentBase from './base';

export default class ComponentMenuSelector extends ComponentBase {

  private buttonList:Button[] = [];
  private buttonBack:Button;
  private buttonLabels:string[] = [
    'Card Shuffle',
    'Text Mixer',
    'Fire Particles'
  ];

  constructor(protected app:PIXI.Application, private stageCallback:(index:number)=>void) {
    super(app);
    this.init();
    app.stage.addChild(this);
  }

  public start = () => {
    _.each(this.buttonList, button => {
      button.visible = true;
    });
    this.buttonBack.visible = false;
  }

  public stop = () => {
    _.each(this.buttonList, button => {
      button.visible = false;
    });
    this.buttonBack.visible = true;
  }

  private init = () => {
    for (let i = 0; i < this.buttonLabels.length; i++) {
      let button:Button = new Button({
        x: this.app.renderer.width/2 - 100,
        y: this.app.renderer.height/2 + 50 * i + 30 * i - (50 * this.buttonLabels.length + 30 * this.buttonLabels.length)/2,
        width: 200,
        height: 50,
        label: this.buttonLabels[i],
        index: i+1,
        stageCallback: this.stageCallback
      });
      this.buttonList.push(button);
      this.addChild(button);
    }

    this.buttonBack = new Button({
      x: this.app.renderer.width/2 - 100,
      y: this.app.renderer.height - 100,
      width: 200,
      height: 50,
      label: 'Back',
      index: 0,
      stageCallback: this.stageCallback
    });
    this.addChild(this.buttonBack);
    this.buttonBack.visible = false;
  }
}

interface IButton {
  x:number,
  y:number,
  width:number,
  height:number,
  label:string,
  index:number,
  stageCallback:(index:number)=>void
}

class Button extends PIXI.Sprite {

  private body:PIXI.Graphics = new PIXI.Graphics();
  private shadow:PIXI.Graphics = new PIXI.Graphics();
  private label:PIXI.Text;

  constructor(private config:IButton) {
    super();
    
    this.x = config.x;
    this.y = config.y;
    this.interactive = true;
    this.buttonMode = true;
    this.init();
    this
      .on('pointerdown', this.pointerDown)
      .on('pointerup', this.pointerUp)
      .on('pointerupoutside', this.pointerUpOutside);
  }

  private init = () => {
    this.shadow.beginFill(0x333333, 0.5);
    this.shadow.drawRoundedRect(0, 0, this.config.width, this.config.height, 8);
    this.shadow.y = 5;
    this.body.beginFill(0xFFFFFF);
    this.body.drawRoundedRect(0, 0, this.config.width, this.config.height, 8);

    this.label = new PIXI.Text(this.config.label, {
      fontFamily: 'arial',
      fontSize: 20,
      fill: 0x333333
    });

    this.label.x = this.config.width/2 - this.label.width/2;
    this.label.y = this.config.height/2 - this.label.height/2;
    this.addChild(this.shadow, this.body);
    this.body.addChild(this.label);
  }

  private pointerDown = () => {
    this.body.y = 3;
  }

  private pointerUp = () => {
    this.config.stageCallback(this.config.index);
    this.body.y = 0;
  }
  private pointerUpOutside = () => {
    this.body.y = 0;
  }
}