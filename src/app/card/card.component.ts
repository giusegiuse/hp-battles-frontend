import {AfterViewInit, Component, computed, EventEmitter, input, Output, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Character} from "../model/character";
import {CharacterService} from "../services/character/character.service";
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import {CardService} from "../services/card/card.service";
import {AudioService} from "../services/audio/audio.service";
import {ChallengeService} from "../services/challenge/challenge.service";

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, NgbTooltipModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',

})
export class CardComponent implements AfterViewInit{
  isChallenge = input<boolean>(false);
  isOpponentCharacter = input<boolean>(false);
  i = input<number>(0, {alias: "characterIndex"});
  character =  input.required<Character>();
  isSelected = signal(false)

  constructor(
    public characterService: CharacterService,
    private cardService: CardService,
    private audioService:AudioService,
    private challengeService: ChallengeService
  ){}

  ngAfterViewInit() {
    //TODO fix this sound to
    //this.playCharacterSound();
  }

  getCardBackground(character: Character): string {
    return this.cardService.getCardBackground(character)
  }

  getCardHeaderBackground(character: Character): string {
    return this.cardService.getCardHeaderBackground(character)
  }

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
        const newCharacterLife = await this.challengeService.handleAttack()
        if(newCharacterLife) this.character().life = newCharacterLife
      }
      else{
        isNotAlreadySelected = await this.characterService.characterIsSelectable(characterId)
      }
      if(isNotAlreadySelected) this.isSelected.set(true)
      else this.isSelected.set(false)
    }catch(e){}
  }

  playCharacterSound() {
    this.audioService.playAudio(`/assets/sounds/card-mixing.mp3`)
  }
}
