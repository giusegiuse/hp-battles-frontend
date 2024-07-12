import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {backendUrl} from "../../constants";
import {Character} from "../../model/character";

@Injectable({
  providedIn: 'root'
})
export class DeckService {

  constructor(public httpClient: HttpClient) { }

  async getDeckCharacters(userId: string): Promise<Character[]> {
    const characters = await firstValueFrom((this.httpClient.get<any>(`${backendUrl}/api/deck/characters/${userId}`)))
    return characters.data
  }

  async getOpponentDeckCharacters(userId: string): Promise<Character[]> {
    const characters = await firstValueFrom((this.httpClient.get<any>(`${backendUrl}/api/deck/opponentCharacters/${userId}`)))
    return characters.data
  }

  async addCharacter(characterId: string, userId: string): Promise<HttpErrorResponse> {
    return await firstValueFrom((this.httpClient.post<HttpErrorResponse>(`${backendUrl}/api/deck/addCharacter`, {
      characterId: characterId,
      userId: userId
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

  async getCurrentLifeCharacters(characterId: string, userId: string): Promise<number> {
    const data = await firstValueFrom((this.httpClient.get<any>(`${backendUrl}/api/deck/${userId}/opponent-current-life/character/${characterId}/`)))
    return data.data
  }

  async updateCharacterLifeInBackend(characterId: string, newLife: number, opponentUserId: string): Promise<boolean> {
    try {
      await firstValueFrom(this.httpClient.post(`${backendUrl}/api/deck/character/update-life`, {
        newLife: newLife,
        opponentUserId: opponentUserId,
        opponentCharacterId: characterId,
      }));
      return true;
    } catch (error) {
      console.error('Failed to update character life in backend:', error);
      return false;
    }
  }

  async checkIfThereAreLivingCharacters(opponentUserId: string): Promise<boolean> {
    const response = await firstValueFrom((this.httpClient.get<any>(`${backendUrl}/api/deck/${opponentUserId}/check-characters-in-life`)))
    return response.data
  }
}
