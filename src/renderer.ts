import {WebGL} from "webglmusti";
import { CEngine } from "./engine";

import Colour = WebGL.Colour;

type Int32 = number;
type Float = number;

export class CRenderer extends WebGL.App.SimpleAppRenderer<CEngine>{
  colour_shader: WebGL.Shader.MVPColourProgram;

  constructor(w: Int32, h: Int32){
    super(w, h);
    this.colour_shader = new WebGL.Shader.MVPColourProgram();
  }
  render(e: CEngine){
    WebGL.WebGL.drawColourRect(
      this.orthographic, this.colour_shader, 
      10, 10, 40, 50, WebGL.Colour.ColourUtils.red()
    );

    e.main_screen.drawBackground(this.orthographic, this.colour_shader, Colour.ColourUtils.blue());
  }
}