import { WebGL } from "webglmusti";
import * as City from "./../city/city";
import * as Resources from  "./resources";

import InterfaceElement = WebGL.Interface.InterfaceElement.InterfaceElement;
import TransformationMatrix = WebGL.Matrix.TransformationMatrix3x3;
import Shader = WebGL.Shader;
import Point2D = WebGL.Geometry.Base.Point2D;
import Colour = WebGL.Colour;

type Int32 = number;
type Float = number;

class StatInterface{

}

class CityTile{
  //todo
  resource_concentration: Resources.ResourceTileConcentration;
  texture_representation: string;

  constructor(){
    this.resource_concentration = new Resources.ResourceTileConcentration();
    this.texture_representation = this.resource_concentration.getTileTextureString();
  }
  getTexture(): string{
    return this.texture_representation;
  }
}

class CityGrid extends WebGL.Grid.Generic.GenericGrid2DInterface<WebGL.Grid.Generic.GenericGrid2D<Int32>>{
  outline_draw_model: WebGL.BasicModel;
  constructor(){
    super(100, 100, 16, new WebGL.Grid.Generic.GenericGrid2D<Int32>(20, 20));
    this.grid.setAll(0);
    WebGL.BasicModel.init();
    this.outline_draw_model = this.generateModel(2); //  todo change to generateGridOutlineModel
  }
  

  draw(vp: TransformationMatrix, 
    colour_shader: Shader.MVPColourProgram, 
    texture_shader: Shader.MVPTextureProgram,
    textures: WebGL.Texture.GenericTextureCollection
  ){
    texture_shader.use();
    //draw tiles
    for(let y = 0; y < this.grid.getHeight(); y++){
      for(let x = 0; x < this.grid.getWidth(); x++){
        const tile_id = this.grid.get(x, y)!; // to add actual tile: todo

        const tx = this.x + (x+0.5)*this.cell_size;//to replace in .11 with getCenterGlobalXYFromCoord
        const ty = this.y + (y+0.5)*this.cell_size;
        textures.active("grass", 0);
        texture_shader.setTextureId(0);
        const model = WebGL.WebGL.rectangleModel(tx, ty, this.cell_size, this.cell_size);
        texture_shader.setMvp(vp.multiplyCopy(model));
        WebGL.Shapes.CenterQuad.draw();
      }
    }


    //grid outline
    this.outline_draw_model.draw(vp);
  }
}

export class CityMap{
  grid: CityGrid;
  close: WebGL.Interface.InterfaceElement.InterfaceElement;
  is_open: boolean;
  constructor(){
    this.grid = new CityGrid();

    this.close = new InterfaceElement(10, 10, 30, 30);
    this.is_open = false;

    CityMapGen.testGen(this.grid);
  }
  loadCity(city: City.City){
    this.is_open = true;
  }
  onMouseMove(global_mouse: Point2D){
    if(!this.is_open){
      return;
    }
    if(this.close.isInside(global_mouse)){

    }
  }
  onMouseDown(global_mouse: Point2D){
    if(!this.is_open){
      return;
    }
    if(this.close.isInside(global_mouse)){
      this.is_open = false;
    }
  }
  onMouseUp(){
    if(!this.is_open){
      return;
    }
  }

  draw(vp: TransformationMatrix, colour_shader: Shader.MVPColourProgram, 
    texture_shader: Shader.MVPTextureProgram,
    textures: WebGL.Texture.GenericTextureCollection
  ){
    if(!this.is_open) return;
    this.close.drawBackground(vp, colour_shader, Colour.ColourUtils.red());
    this.grid.draw(vp, colour_shader, texture_shader, textures);
  }
}

//todo test procedral gen

// choose spot on map away from edges, 
// choose 2 resources 

class CityMapGen{
  //
  static testGen(grid: CityGrid){
    const resources = Resources.ResourceBank.getRandomResources(2);
    console.log(resources);

    //const center

    const width = grid.grid.getWidth();
    const height = grid.grid.getHeight();
    const circle_size = 3;
    //pick point in rectangle (center of map)
    const center_grid_rect = new WebGL.Grid.Algorithm.GridRectArea(circle_size, circle_size, 
      width-(circle_size+circle_size), height-(circle_size+circle_size));

    const random_coord = center_grid_rect.randomCoordinate();
    
  }
}