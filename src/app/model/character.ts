import {Ability} from "./ability";

export class Character {
  constructor(
    public _id: string,
    public name: string,
    public strength: number,
    public life: number,
    public specialAbility: Ability,
    public image: string,
    public cost: number,
    public faction: string
  ) {
  }
}
