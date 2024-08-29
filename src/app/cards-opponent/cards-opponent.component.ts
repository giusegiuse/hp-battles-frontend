import {Component, input, viewChildren} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Character} from "../model/character";
import {CardComponent} from "../card/card.component";

@Component({
  selector: 'app-opponent-card',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './cards-opponent.component.html',
  styleUrl: './cards-opponent.component.scss',
})

export class CardsOpponentComponent {
  opponentCards = viewChildren<CardComponent>(CardComponent)
  opponentCharacters = input.required<Character[]>()

  getCardPosition(cardIndex: number): DOMRect | null {
    const cards = this.opponentCards();
    if (cards && cardIndex < cards.length) {
      const card = cards[cardIndex];
      return card.el.nativeElement.getBoundingClientRect();
    }
    return null;
  }
}

