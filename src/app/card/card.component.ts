import {Component, computed, EventEmitter, input, Output, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Character} from "../model/character";
import {CharacterService} from "../services/character/character.service";
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, NgbTooltipModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',

})
export class CardComponent {
  isChallenge = input<boolean>(false);
  isOpponentCharacter = input<boolean>(false);
  i = input<number>(0, {alias: "characterIndex"});
  character =  input.required<Character>();
  isSelected = signal(false)

  constructor(
    public characterService: CharacterService
  ){}

  // getCardBackground(): string {
  //   return this.character.faction === 'good' ? 'linear-gradient(to bottom right, #ffd700, #b8860b)' : 'darkgreen'
  // }

  getCardBackground = computed(() => {
    return this.character().faction === 'good' ? 'linear-gradient(to bottom right, #ffd700, #b8860b)' : 'darkgreen'
  })

  // getCardHeaderBackground(character: Character): string {
  //   return character.faction === 'good' ? 'linear-gradient(to bottom right, #ffd700, #b8860b)' : 'darkgreen'
  // }

  getCardHeaderBackground = computed(() => {
    return this.character().faction === 'good' ? 'linear-gradient(to bottom right, #ffd700, #b8860b)' : 'darkgreen'
  })

  getCardHeight = computed(() => {
    return this.isChallenge() ? '330px' : '550px'
  })

  getCardWidth =  computed(() => {
    return this.isChallenge() ? '160px' : '250px'
  })

  getImageHeight = computed(() => {
    return this.isChallenge() ? '200px' : '300px'
  })

  getImageWidth = computed(() => {
    return this.isChallenge() ? '100%' : '300px'
  })

  getCardLeftMargin = computed(() => {
    return this.isChallenge() ? '5px 5px' : '20px 20px'
  })

  characterIsSelected(): boolean{
    return this.isSelected();
  }

  async selectCharacter(characterId: string){
    try{
      let isNotAlreadySelected
      if(this.isOpponentCharacter()){
        isNotAlreadySelected = await this.characterService.opponentCharacterIsSelectable(characterId)
      }
      else{
        isNotAlreadySelected = await this.characterService.characterIsSelectable(characterId)
      }
      if(isNotAlreadySelected) this.isSelected.set(true)
      else this.isSelected.set(false)
    }catch(e){}
  }
}
