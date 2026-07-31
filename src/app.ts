import {WebGL} from "webglmusti";
import { CEngine } from "./engine";
import { CRenderer } from "./renderer";

export function createApp(canvas: HTMLCanvasElement): WebGL.App.App<CEngine>{
  const engine = new CEngine();
  const renderer = new CRenderer(canvas.clientWidth, canvas.clientHeight);
  return new WebGL.App.App(engine, renderer);
}

