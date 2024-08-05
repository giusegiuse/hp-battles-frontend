import {Component, input, QueryList, ViewChildren} from '@angular/core';
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
  @ViewChildren(CardComponent) playerCards!: QueryList<CardComponent>;

  characters = input.required<Character[]>()

  constructor() {}

  getCardPosition(cardIndex: number): DOMRect | null {
    const card = this.playerCards.toArray()[cardIndex];
    return card ? card.el.nativeElement.getBoundingClientRect() : null;
  }



}
