import { WebGL } from "webglmusti";
import * as City from "./../city/city";
import * as Resources from  "./resources";
import * as Building from "./building";

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
  static cid = 0;
  resource_concentration: Resources.ResourceTileConcentration;
  building: Building.ResourceExtractor | undefined;
  texture_representation: string;
  private id: Int32;
  constructor(){
    this.resource_concentration = new Resources.ResourceTileConcentration();
    this.texture_representation = this.resource_concentration.getTileTextureString();
    this.id = CityTile.cid;
    CityTile.cid++;
  }
  getId(): Int32{
    return this.id;
  }
  addBuilding(building: Building.ResourceExtractor){
    this.building = building;
    this.texture_representation = "building";

  }
  addRandomNaturalResource(res: Resources.BuildingResource, amount: Float, variance: Float=0.2){
    this.resource_concentration.addRandomNaturalResource(res, amount, variance);
    if(this.building == undefined){
      this.texture_representation = this.resource_concentration.getTileTextureString();
    }
  }
  getTexture(): string{
    return this.texture_representation;
  }
}

class CityGrid extends WebGL.Grid.Generic.GenericGrid2DInterface<WebGL.Grid.Generic.GenericGrid2D<Int32>>{
  outline_draw_model: WebGL.BasicModel;
  tiles: Map<Int32, CityTile>;
  constructor(){
    super(100, 100, 16, new WebGL.Grid.Generic.GenericGrid2D<Int32>(20, 20));
    this.tiles = new Map();
    for(let y = 0; y < this.grid.getHeight(); y++){
      for(let x = 0; x < this.grid.getWidth(); x++){
        const tile = new CityTile();
        this.tiles.set(tile.getId(), tile);
        this.grid.set(x, y, tile.getId());
      }
    }
    //this.grid.setAll(0);
    WebGL.BasicModel.init();
    this.outline_draw_model = this.generateModel(2); //  todo change to generateGridOutlineModel
  }

  getTile(x: Int32, y: Int32): CityTile | undefined{
    const tile_id = this.grid.get(x, y);
    if(tile_id == undefined){
      return undefined;
    }
    return this.tiles.get(tile_id);
  }

  setTileResource(x: Int32, y: Int32, resource: Resources.BuildingResource, value: Float){
    const tile = this.getTile(x, y);
    tile?.addRandomNaturalResource(resource, value);
    console.log(tile);
  }

  addBuilding(x: Int32, y: Int32, b: Building.ResourceExtractor){
    const tile = this.getTile(x, y);
    if(tile != undefined){
      console.log("building added");
      tile.addBuilding(b);
    }
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
        const tile = this.getTile(x, y);
        if(tile != undefined){
          const texture_str = tile.getTexture();
          textures.active(texture_str, 0);
          texture_shader.setTextureId(0);
        }
        //const tile_id = this.grid.get(x, y)!; // to add actual tile: todo

        const tx = this.x + (x+0.5)*this.cell_size;//to replace in .11 with getCenterGlobalXYFromCoord
        const ty = this.y + (y+0.5)*this.cell_size;
        //textures.active("grass", 0);
        //texture_shader.setTextureId(0);
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
  buildings: Building.ResourceExtractor[];// to add
  constructor(){
    this.grid = new CityGrid();

    this.close = new InterfaceElement(10, 10, 30, 30);
    this.is_open = false;

    this.buildings = [];

    CityMapGen.testGen(this.grid, this);
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
  static testGen(grid: CityGrid, map: CityMap){
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
    grid.setTileResource(random_coord.x, random_coord.y, resources[0], 0.6);
    const adjs = WebGL.Grid.Generic.CoordinateChunk.adjacent(random_coord);

    const rand_adj = adjs[Math.floor(Math.random()*adjs.length)];

    const res_building = new Building.ResourceExtractor(rand_adj, resources[0]);
    map.buildings.push(res_building);
    grid.addBuilding(rand_adj.x, rand_adj.y, res_building);
    //adj.
  }
}