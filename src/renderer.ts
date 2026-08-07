import {WebGL} from "webglmusti";
import { CEngine } from "./engine";

import Colour = WebGL.Colour;
import TMatrix3 = WebGL.Matrix.TransformationMatrix3x3;
import Shapes = WebGL.Shapes;

type Int32 = number;
type Float = number;

export class CRenderer extends WebGL.App.SimpleAppRenderer<CEngine>{
  colour_shader: WebGL.Shader.MVPColourProgram;
  circle_shader: WebGL.Shader.MVPCircleOnlyProgram;

  constructor(w: Int32, h: Int32){
    super(w, h);

    //setup fonts
    this.font_names.push("font16-Sheet.png");


    this.colour_shader = new WebGL.Shader.MVPColourProgram();
    this.circle_shader = new WebGL.Shader.MVPCircleOnlyProgram();
  }
  render(e: CEngine){
    WebGL.WebGL.drawColourRect(
      this.orthographic, this.colour_shader, 
      10, 10, 40, 50, WebGL.Colour.ColourUtils.red()
    );

    e.main_screen.drawBackground(this.orthographic, this.colour_shader, Colour.ColourUtils.blue());
    //e.main_screen.enableScissors();
    //use mainscreen scissors after update
    WebGL.WebGL.enableScissor(e.main_screen.x, e.main_screen.y, e.main_screen.width, e.main_screen.height);
    this.drawCities(e);

    WebGL.WebGL.disableScissor();
    //e.main_screen.disableScissors();


    if(e.main_screen.game_mouse != undefined){
      const s = `${e.main_screen.game_mouse.x.toFixed(2)}, ${e.main_screen.game_mouse.y.toFixed(2)}`;
      this.text_drawer.drawText(this.orthographic, 400, 40, s, 12);
    }
  }

  drawCities(engine: CEngine){
    const city_radius = 1;
    const cp = city_radius*engine.main_screen.pixels_per_unit;
    const hcp = cp*0.5;
    this.circle_shader.use();
    this.circle_shader.setCircleColourFromColourRGB(WebGL.Colour.ColourUtils.white());
    this.circle_shader.setRadius(0.5);
    this.circle_shader.setCentre(0.5, 0.5);
    const gl = WebGL.WebGL.gl!;

    // can use interface element after update

    // can use webgl.blend after update
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    for(const city of engine.cities){
      const centre = engine.main_screen.gamePointToGlobalPoint(city.getPoint());
      const model = WebGL.WebGL.rectangleModel(centre.x-hcp, centre.y-hcp, cp, cp);
      this.circle_shader.setMvp(this.orthographic.multiplyCopy(model));
      Shapes.Quad.draw();
    }
    gl.disable(gl.BLEND);
  }
}