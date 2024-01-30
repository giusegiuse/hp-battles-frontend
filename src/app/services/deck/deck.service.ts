import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {backendUrl} from "../../constants";

@Injectable({
  providedIn: 'root'
})
export class DeckService {

  constructor(public httpClient: HttpClient) { }

  async addCharacter(characterId: string): Promise<number> {
    return await firstValueFrom((this.httpClient.post<number>(`${backendUrl}/api/deck/addCharacter`, {
      id: characterId,
    })))
  }

  async removeCharacter(characterId: string): Promise<number> {
    return await firstValueFrom((this.httpClient.delete<number>(`${backendUrl}/api/deck/removeCharacter/${characterId}`, {
    })))
  }

  async createDeck(userId: string) {
    return await firstValueFrom((this.httpClient.post<number>(`${backendUrl}/api/deck/create`, {
      userId
    })))
  }
}
