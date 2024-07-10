import {Component, input} from '@angular/core';
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
  opponentCharacters = input.required<Character[]>()
}
