import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {backendUrl} from "../../constants";
import {Character} from "../../model/character";

@Injectable({
  providedIn: 'root'
})
export class DeckService {

  constructor(public httpClient: HttpClient) { }

  async getDeckCharacters(userId: string): Promise<Character[]> {
    const deck = await firstValueFrom((this.httpClient.get<any>(`${backendUrl}/api/deck/characters/${userId}`)))
    console.log("charachers "+ JSON.stringify(deck))
    return deck
  }

  async addCharacter(characterId: string): Promise<HttpErrorResponse> {
    return await firstValueFrom((this.httpClient.post<HttpErrorResponse>(`${backendUrl}/api/deck/addCharacter`, {
      id: characterId,
    })))
  }

  async removeCharacter(characterId: string): Promise<number> {
    return await firstValueFrom((this.httpClient.delete<number>(`${backendUrl}/api/deck/removeCharacter/${characterId}`, {
    })))
  }

  async createDeck(userId: string, challengeId: string) {
    return await firstValueFrom((this.httpClient.post<number>(`${backendUrl}/api/deck/create`, {
      userId,
      challengeId
    })))
  }
}
