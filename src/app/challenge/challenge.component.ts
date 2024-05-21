import {Component, inject} from '@angular/core';
import {FooterComponent} from "../footer/footer.component";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {Character} from "../model/character";
import {JsonPipe} from "@angular/common";
import {CardsPlayerComponent} from "../cards-player/cards-player.component";
import {CharactersStore} from "../store/characters.store";
import {AuthenticationService} from "../services/authentication/authentication.service";
import {CardsOpponentComponent} from "../cards-opponent/cards-opponent.component";

@Component({
  selector: 'app-challenge',
  standalone: true,
  imports: [FooterComponent, JsonPipe, CardsPlayerComponent, CardsOpponentComponent],
  templateUrl: './challenge.component.html',
  styleUrl: './challenge.component.scss'
})
export class ChallengeComponent {
  characters: Character[] = []
  opponentCharacters: Character[] = []
  charactersStore = inject(CharactersStore)

  constructor(
    private authenticationService: AuthenticationService,
  ){}

  ngOnInit() {
    this.loadCharacters(this.authenticationService.userId!).then(characters => {
      this.characters = characters;
    }).catch(error => {
      console.error("Error loading characters:", error);
    });
    this.loadOpponentCharacters(this.authenticationService.userId!).then(characters => {
      this.opponentCharacters = characters;
    }).catch(error => {
      console.error("Error loading opponent characters:", error);
    });
  }

  async loadCharacters(userId: string): Promise<Character[]> {
    return await this.charactersStore.loadCharactersDeck(userId)
  }

  async loadOpponentCharacters(userId: string): Promise<Character[]> {
    return await this.charactersStore.loadOpponentCharactersDeck(userId)
  }
}
