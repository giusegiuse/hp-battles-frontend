import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {Character} from "../model/character";

@Injectable({
  providedIn: 'root'
})
export class CharacterServiceService {

  constructor(public httpClient: HttpClient) { }


  async getCharacters(): Promise<Character[]>{
    return await firstValueFrom((this.httpClient.get<any>(`http://localhost:3000/api/character`)))
  }
}
