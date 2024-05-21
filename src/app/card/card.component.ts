import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Character} from "../model/character";


@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() character: Character | undefined;
  @Input({alias: "characterIndex"}) i: number = 0;
  @Input() isChallenge?: boolean = false;
  @Input() isOpponentCharacter?: boolean = false;

  getCardBackground(character: Character): string {
    return character.faction === 'good' ? 'linear-gradient(to bottom right, #ffd700, #b8860b)' : 'darkgreen'
  }

  getCardHeaderBackground(character: Character): string {
    return character.faction === 'good' ? 'linear-gradient(to bottom right, #ffd700, #b8860b)' : 'darkgreen'
  }

  getCardHeight() {
    return this.isChallenge ? '350px' : '550px'
  }

  getCardWidth() {
    return this.isChallenge ? '160px' : '250px'
  }

  getImageHeight() {
    return this.isChallenge ? '200px' : '300px'
  }

  getImageWidth() {
    return this.isChallenge ? '100%' : '300px'
  }

  getCardLeftMargin() {
    return this.isChallenge ? '5px 5px' : '20px 20px'
  }
}
