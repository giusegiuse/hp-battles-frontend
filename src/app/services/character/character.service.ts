import {Injectable, signal} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {Character} from "../../model/character";
import {backendUrl} from "../../constants";

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  characterSelected = signal('')
  opponentCharacterSelected = signal('')

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

  async characterIsSelectable(characterId: string): Promise<boolean> {
    const isSelectable = this.isAnotherCharacterTypeSelected(characterId, this.characterSelected())
    if(isSelectable){
      this.characterSelected.set(characterId)
    }
    else{
      this.characterSelected.set('')
    }
    return isSelectable
  }

  async opponentCharacterIsSelectable(characterId: string): Promise<boolean> {
    const isNobodyOpponentCharacterSelected = this.isAnotherCharacterTypeSelected(characterId, this.opponentCharacterSelected())
    const isSelectable = isNobodyOpponentCharacterSelected && this.characterSelected()!==''
    if(isSelectable){
      this.opponentCharacterSelected.set(characterId)
    }
    else{
      this.opponentCharacterSelected.set('')
    }
    return isSelectable
  }

  isAnotherCharacterTypeSelected(characterId: string, characterSelected: string): boolean{
    if(characterSelected && characterSelected !== characterId){
      throw new Error('another character is already selected')
    }
    else if(characterSelected && characterSelected === characterId){
      return false
    }
    return true
  }


}
