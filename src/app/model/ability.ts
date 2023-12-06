export class Ability {
  constructor(
    public name: string,
    public description: string,
    public type: AbilityType,
    public duration: number
  ) {  }
}

export enum AbilityType{
  Potenziante = 'potenziante'
}
