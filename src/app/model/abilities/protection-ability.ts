import { Ability, AbilityType } from '../ability';
import { Character } from '../character';

export class InvulnerabilityAbility extends Ability {
  constructor(name: string, description: string, duration: number) {
    super(name, description, AbilityType.Protection, duration);
  }

  override activate(character: Character): void {
    console.log(`${character.name} è invulnerabile per ${this.duration} turni con l'abilità ${this.name}.`);

  }
}

export class Protego extends InvulnerabilityAbility {
  constructor(duration: number) {
    super('Protego', 'Rende la carta invulnerabile con Protego', duration);
  }
}
