import { Injectable } from '@angular/core';
import {Character} from "../../model/character";

@Injectable({
  providedIn: 'root'
})
export class CardService {


  getCardHeaderBackground(character: Character): string {
    switch (character.faction) {
      case 'gryffindor':
        return 'linear-gradient(to bottom right, #ffd700, #b8860b)'
      case 'bad':
        return 'darkgreen'
      case 'Ravenclaw':
        return 'linear-gradient(to right bottom, rgb(169, 169, 169), rgb(0, 0, 0))'
      case 'Hufflepuff':
        return 'linear-gradient(to right bottom, rgb(255, 69, 0), rgb(139, 0, 0))'
      default:
        return 'linear-gradient(to bottom right, #ffd700, #b8860b)'
    }
  }

  getCardBackground(character: Character): string {
    switch (character.faction) {
      case 'gryffindor':
        return 'linear-gradient(to bottom right, #ffd700, #b8860b)'
      case 'bad':
        return 'darkgreen'
      case 'Ravenclaw':
        return 'linear-gradient(to right bottom, rgb(169, 169, 169), rgb(0, 0, 0))'
      case 'Hufflepuff':
        return 'linear-gradient(to right bottom, rgb(255, 69, 0), rgb(139, 0, 0))'
      default:
        return 'linear-gradient(to bottom right, #ffd700, #b8860b)'
    }
  }

}
