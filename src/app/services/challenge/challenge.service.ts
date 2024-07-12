import {inject, Injectable, signal} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {backendUrl} from "../../constants";
import {ChallengeCreationResponse} from "../../model/interface/challengeCreationResponse";
import {Opponent} from "../../model/opponent";
import {CharactersStore} from "../../store/characters.store";
import {CharacterService} from "../character/character.service";
import {DeckService} from "../deck/deck.service";
import {AuthenticationService} from "../authentication/authentication.service";

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {

  opponentUserId = signal('')
  opponentUserInfo = signal(new Opponent(0, '', '', ''))
  charactersStore = inject(CharactersStore)

  constructor(
    public httpClient: HttpClient,
    public characterService: CharacterService,
    public deckService: DeckService,
    private authenticationService: AuthenticationService,
  ) {
  }

  async getOpponentUserId(userId: string) {
    if (this.opponentUserId() === '') {
      this.opponentUserId.set(await firstValueFrom(this.httpClient.get<string>(`${backendUrl}/api/challenge/${userId}/opponent-user-id/`)))
    }
    return this.opponentUserId()
  }


  async getOpponentUserInfo(opponentUserId: string): Promise<Opponent> {
    if (this.opponentUserInfo().id === 0) {
      const sanitizedId = sanitizeString(opponentUserId)
      const response = (await firstValueFrom(this.httpClient.get<any>(`${backendUrl}/api/users/${sanitizedId}/opponent`))).data
      this.opponentUserInfo.set(response)
    }
    return this.opponentUserInfo()
  }

  async createChallenge(userId: string, opponentUserId: string) {
    return await firstValueFrom((this.httpClient.post<number>(`${backendUrl}/api/challenge/`, {
      playerOne: userId, playerTwo: opponentUserId
    })))
  }

  async createOnePlayerChallenge(userId: string, opponentUserId: string): Promise<ChallengeCreationResponse> {
    this.opponentUserId.set(opponentUserId)
    return await firstValueFrom((this.httpClient.post<ChallengeCreationResponse>(`${backendUrl}/api/challenge/one-player`, {
      playerOne: userId, playerTwo: opponentUserId
    })))
  }

  async checkInProgressChallenge(userId: string): Promise<string> {
    return await firstValueFrom((this.httpClient.get<string>(`${backendUrl}/api/challenge/check-in-progress-challenge/${userId}`)))
  }

  async deleteAllInProgressChallenges(userId: string): Promise<string> {
    return await firstValueFrom((this.httpClient.delete<string>(`${backendUrl}/api/challenge/delete-all-in-progress-challenges/${userId}`)))
  }

  async setChallengeWinner(userId: string): Promise<string> {
    return await firstValueFrom((this.httpClient.patch<string>(`${backendUrl}/api/challenge/set-challenge-winner/${userId}`, {})))
  }

  async handleAttack(): Promise<number | undefined> {
    const myCharacterSelectedId = this.characterService.characterSelected()
    const opponentCharacterSelectedId = this.characterService.opponentCharacterSelected()
    const myCharacter = await this.charactersStore.getMyCharacterById(myCharacterSelectedId)
    const opponentCharacter = await this.charactersStore.getOpponentCharacterById(opponentCharacterSelectedId)
    if (myCharacter && opponentCharacter) {
      let newLife
      if(opponentCharacter.life - myCharacter.strength <=0) newLife=0
      else newLife = opponentCharacter.life - myCharacter.strength
      this.charactersStore.updateOpponentCharacterLife(opponentCharacter._id, newLife);
      const backendUpdateSuccess = await this.deckService.updateCharacterLifeInBackend(opponentCharacter._id, newLife, this.opponentUserId());
      if (backendUpdateSuccess) {
        return newLife;
      } else {
        this.charactersStore.updateOpponentCharacterLife(opponentCharacter._id, opponentCharacter.currentLife);
      }
    }
    return undefined
  }

  async checkIfGameOver(): Promise<boolean> {
    const thereAreLivingCharacters=  await this.deckService.checkIfThereAreLivingCharacters(this.opponentUserId())
    if(!thereAreLivingCharacters){
      const userId = this.authenticationService.userId
      if(userId) await this.setChallengeWinner(userId)
      return true
    }
    return false
  }
}

function sanitizeString(text: string){
  let stringWithoutQuotes = decodeURIComponent(text);
  if (stringWithoutQuotes.startsWith('"') && stringWithoutQuotes.endsWith('"')) {
    stringWithoutQuotes = stringWithoutQuotes.slice(1, -1);
  }
  return stringWithoutQuotes
}

