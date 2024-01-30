import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {backendUrl} from "../../constants";

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {

  constructor(
    public httpClient: HttpClient
  ) { }

  async createChallenge(userId: string, opponentUserId: string) {
    return await firstValueFrom((this.httpClient.post<number>(`${backendUrl}/api/challenge/`, {
      playerOne:  userId, playerTwo:  opponentUserId
    })))
  }

  async createOnePlayerChallenge(userId: string, opponentUserId: string) {
   return await firstValueFrom((this.httpClient.post<number>(`${backendUrl}/api/challenge/one-player`, {
     playerOne:  userId, playerTwo:  opponentUserId
   })))
  }
}
