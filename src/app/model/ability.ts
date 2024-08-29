import {Character} from "./character";

export class Ability {
  constructor(
    public name: string,
    public description: string,
    public type: AbilityType,
    public duration: number
  ) {  }

  activate(character: Character): void {
  }
}

export enum AbilityType{
  Empowering = 'empowering',
  Protection = 'protection',
  Poison = 'poison',
  Blocker = 'blocker'
}
