import {Component, input, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Character} from "../model/character";
import {CardComponent} from "../card/card.component";

@Component({
  selector: 'app-cards-player',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './cards-player.component.html',
  styleUrl: './cards-player.component.scss'
})
export class CardsPlayerComponent {
  @Input() characters?: Character[];
  @Input() opponentCharacters?: Character[];
}
