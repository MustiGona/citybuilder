
type Int32 = number;
//stone, clay, wood, 

const BuildingResourceEnum = {
  stone: 0,
  clay: 1,
  wood: 2
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
}