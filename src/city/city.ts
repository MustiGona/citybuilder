import {WebGL} from "webglmusti";
import * as Resource from "./../city_screen/resources";

import Geometry = WebGL.Geometry;
import Point2D = Geometry.Base.Point2D;

type Int32 = number;
type Float = number;


export class City extends Geometry.Circle.Circle{
  static current_id = 0;
  id: Int32;

  name: string;
  population: Int32;

  resources: Resource.ResourceBank;

  constructor(x: Float, y: Float){
    super(x, y, 0.3);
    this.id = City.current_id;
    City.current_id++;

    this.name = "City "+this.id.toString();
    this.population = 20;

    this.resources = new Resource.ResourceBank();
  }
  getPoint(): Point2D{
    return this.centre;
  }
  isInside(pt: Point2D): boolean{
    return this.collisionPoint(pt);
  }
}