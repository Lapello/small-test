import './index.css';
import PIXI_APP from './pixi-app/app';

export const runApp = () => {
  const app:PIXI_APP = new PIXI_APP(window.innerWidth, window.innerHeight);
  document.body.appendChild(app.getView());
}

runApp();