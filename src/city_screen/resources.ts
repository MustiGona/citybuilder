import { WebGL } from "webglmusti";
type Int32 = number;
//stone, clay, wood, 

const BuildingResourceEnum = {
  Stone: 0,
  Clay: 1,
  Wood: 2
} as const;

export type BuildingResource = (typeof BuildingResourceEnum)[keyof typeof BuildingResourceEnum];

export class ResourceBank{
  resources: Map<BuildingResource, Int32>;
  limit: Int32;
  constructor(l: Int32=1000){
    this.resources = new Map();
    for(const v of Object.values(BuildingResourceEnum)){
      this.resources.set(v, 0);
    }
    this.limit = l;
  }

  static getRandomResources(n: Int32=1): BuildingResource[]{
    //const res = [];
    const num_resources = Object.keys(BuildingResourceEnum).length;
    const rand = WebGL.Utils.Array.random0ToN(num_resources);
    return rand.slice(0, n) as BuildingResource[];
  }
}