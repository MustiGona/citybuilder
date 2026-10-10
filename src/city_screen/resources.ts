import { WebGL } from "webglmusti";
type Int32 = number;
type Float = number;
//stone, clay, wood, 

export const BuildingResourceEnum = {
  Stone: 0,
  Clay: 1,
  Wood: 2
} as const;

export type BuildingResource = (typeof BuildingResourceEnum)[keyof typeof BuildingResourceEnum];

export class ResourceTileConcentration{
  resource_concentration: Map<BuildingResource, Float>;
  constructor(){
    this.resource_concentration = new Map();
    for(const [_, id] of Object.entries(BuildingResourceEnum)){
      this.resource_concentration.set(id, 0);
    }
  }
  addRandomNaturalResource(res: BuildingResource, amount: Float, variance: Float=0.2){
    const r_var = Math.random()*variance - variance*0.5;
    let ram = amount + r_var;
    if(ram < 0){
      ram = 0;
    }else if(ram > 1){
      ram = 1;
    }
    this.resource_concentration.set(res, ram);
  }
  getHighestConcentration(): BuildingResource {
    let v = 0;
    let highest: BuildingResource = 0;
    for(const [id, con] of this.resource_concentration){
      if(con > v){
        highest = id;
        v = con;
      }
    }
    return highest;
  }
  getTileTextureString(): string{
    const br = this.getHighestConcentration();
    const val = this.resource_concentration.get(br)!;
    // can tweak
    if(val < 0.2){
      return "grass";
    }
    return ResourceBank.resourceToString(br);
  }
}


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
  static resourceToString(r: BuildingResource): string{
    switch(r){
      case BuildingResourceEnum.Clay:
        return "clay";
      case BuildingResourceEnum.Stone:
        return "stone";
      case BuildingResourceEnum.Wood:
        return "wood";
    }
  }
}