
import {WebGL} from "webglmusti";
import * as App from "./app";


const canvas: HTMLCanvasElement = document.getElementById("app") as HTMLCanvasElement;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

WebGL.WebGL.initialise(canvas);

const app = App.createApp(canvas);

app.loadResources(() => {
  console.log("running app");
  app.initApp();
});

window.addEventListener("resize", (e: Event) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  app.resize(canvas.width, canvas.height, canvas);
});