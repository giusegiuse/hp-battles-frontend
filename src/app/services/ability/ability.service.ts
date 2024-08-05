import { Injectable } from '@angular/core';
import {firstValueFrom} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {backendUrl} from "../../constants";

@Injectable({
  providedIn: 'root'
})
export class AbilityService {


  constructor(
    private httpClient: HttpClient,
  ) { }



  blockCharacter(characterId: string, userId: string, rounds: number) {
    await firstValueFrom(this.httpClient.post(`${backendUrl}/api/ability/block`, {
      characterId,
      userId,
      rounds,
    })
  }


  }

