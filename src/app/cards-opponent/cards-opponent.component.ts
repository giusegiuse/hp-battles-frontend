import {Component, input, QueryList, ViewChildren} from '@angular/core';
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
  @ViewChildren(CardComponent) opponentCards!: QueryList<CardComponent>;

  opponentCharacters = input.required<Character[]>()


  getCardPosition(cardIndex: number): DOMRect | null {
    const card = this.opponentCards.toArray()[cardIndex];
    return card ? card.el.nativeElement.getBoundingClientRect() : null;
  }
}
