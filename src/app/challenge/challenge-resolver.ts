import {AuthenticationService} from "../services/authentication/authentication.service";
import {Injectable} from "@angular/core";
import {DeckService} from "../services/deck/deck.service";
import {Character} from "../model/character";

@Injectable({
  providedIn: 'root'
})

export class ChallengeResolver {

  constructor(
    private deckService: DeckService,
    private authenticationService: AuthenticationService
  ) {}


  async resolve():Promise<Character[]> {
    const userId = this.authenticationService.userId
    if (!userId) throw new Error("Not authenticated")
    return  await this.deckService.getDeckCharacters(userId).catch(() => {
      throw new Error("Not characters found for this challenge")
    })
  }
}
