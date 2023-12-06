import {Ability} from "./ability";

export class Character {
  constructor(
   public name: string,
   public strength: number,
   public life: number,
   public specialAbilities: Ability,
   public image: string,
   public cost: number,
   public faction: string
  ) {
  }
}
