import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {Character} from "../../model/character";
import {backendUrl} from "../../constants";

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  constructor(public httpClient: HttpClient) { }

  async getCharacters(): Promise<Character[]>{
    const characters = await firstValueFrom((this.httpClient.get<any>(`${backendUrl}/api/character`)))
    return characters.data.data
  }

  async selectCharacter(characterId: string): Promise<number> {
     return await firstValueFrom((this.httpClient.post<number>(`${backendUrl}/api/character`, {
        characterId
     })))
  }
}
