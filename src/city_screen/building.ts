import {WebGL} from "webglmusti";
import * as Resource from "./resources";

type Int32 = number;
type Float = number;

//generic resource gatherer for a city
export class ResourceExtractor{
  resource: Resource.BuildingResource;
  efficiency: Float;
  range: Float;
  location: WebGL.Grid.Generic.Coordinate;
  constructor(location: WebGL.Grid.Generic.Coordinate, res: Resource.BuildingResource){
    this.resource = res;
    this.efficiency = 1;
    this.range = 4;
    this.location = location;
  }

  extractFromMap(){
    const surrounding = WebGL.Grid.Algorithm.GridAlgorithms.coordinatesWithinRange(this.range);
    //todo
  }

}