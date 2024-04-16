import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {backendUrl} from "../../constants";
import {Character} from "../../model/character";
import {ChallengeCreationResponse} from "../../model/interface/challengeCreationResponse";

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

  async createOnePlayerChallenge(userId: string, opponentUserId: string): Promise<ChallengeCreationResponse> {
   return await firstValueFrom((this.httpClient.post<ChallengeCreationResponse>(`${backendUrl}/api/challenge/one-player`, {
     playerOne:  userId, playerTwo:  opponentUserId
   })))
  }

  async getChallengeCharacters(userId: string): Promise<Character[]> {
    return await firstValueFrom((this.httpClient.get<any>(`${backendUrl}/api/challenge/characters/${userId}`)))
  }

  async checkInProgressChallenge(userId: string): Promise<string> {
    return await firstValueFrom((this.httpClient.get<string>(`${backendUrl}/api/challenge/check-in-progress-challenge/${userId}`)))
  }


}
