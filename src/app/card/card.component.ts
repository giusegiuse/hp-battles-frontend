import {AfterViewInit, Component, computed, EventEmitter, input, Output, Renderer2, signal} from '@angular/core';
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
    private challengeService: ChallengeService,
    private renderer: Renderer2
  ){
    this.characterService.deselectEvent.subscribe(() => {
      this.isSelected.set(false);
    });
  }

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
        if(newCharacterLife){
          this.animateLife(newCharacterLife, this.character().life)
        }
        setTimeout(() => {
          this.characterService.deselectAll();
        }, 1000);
      }
      else{
        isNotAlreadySelected = await this.characterService.characterIsSelectable(characterId)
      }
      if(isNotAlreadySelected) this.isSelected.set(true)
      else this.isSelected.set(false)
    }catch(e){}
  }

  private animateLife(newLife: number, oldLife: number) {
    const intervalTime = 50;
    const steps = Math.abs(newLife - oldLife);
    const stepValue = (newLife - oldLife) / steps;
    let currentLife = oldLife;
    const index = this.i;
    const element = document.getElementsByClassName("ability-score")[index()] as HTMLElement;

    const updateLife = () => {
      if (element) {
        currentLife += stepValue;
        this.renderer.setProperty(element, 'innerHTML', Math.round(currentLife).toString());

        if ((stepValue > 0 && currentLife >= newLife) || (stepValue < 0 && currentLife <= newLife)) {
          clearInterval(animationInterval);
          this.character().life = newLife;
        }
      } else {
        clearInterval(animationInterval);
      }
    };
    const animationInterval = setInterval(updateLife, intervalTime);
  }

  getLifeLostPercentage(): string {
    const totalLife = 80
    if(this.character().life === totalLife){
      this.character().life = 0
      return "100%"
    }
    const lifeLost = 100 - (this.character().life / totalLife) * 100;
    return `${lifeLost}%`;
  }

  playCharacterSound() {
    this.audioService.playAudio(`/assets/sounds/card-mixing.mp3`)
  }
}
