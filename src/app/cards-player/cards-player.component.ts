import {Component, input, viewChildren} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Character} from "../model/character";
import {CardComponent} from "../card/card.component";

@Component({
  selector: 'app-cards-player',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './cards-player.component.html',
  styleUrl: './cards-player.component.scss',
})

export class CardsPlayerComponent {
  playerCards = viewChildren<CardComponent>(CardComponent);
  characters = input.required<Character[]>()

  constructor() {}

  getCardPosition(cardIndex: number): DOMRect | null {
    const cards = this.playerCards();
    if (cards && cardIndex < cards.length) {
      const card = cards[cardIndex];
      return card.el.nativeElement.getBoundingClientRect();
    }
    return null;
  }
}
