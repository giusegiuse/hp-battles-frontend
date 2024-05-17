import {Component, inject} from '@angular/core';
import {FooterComponent} from "../footer/footer.component";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {Character} from "../model/character";
import {JsonPipe} from "@angular/common";
import {CardComponent} from "../card/card.component";
import {CharactersStore} from "../store/characters.store";
import {AuthenticationService} from "../services/authentication/authentication.service";

@Component({
  selector: 'app-challenge',
  standalone: true,
  imports: [FooterComponent, JsonPipe, CardComponent],
  templateUrl: './challenge.component.html',
  styleUrl: './challenge.component.scss'
})
export class ChallengeComponent {
  characters: Character[] = []
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
  }

  async loadCharacters(userId: string): Promise<Character[]> {
    return await this.charactersStore.loadCharactersDeck(userId)
  }
}
