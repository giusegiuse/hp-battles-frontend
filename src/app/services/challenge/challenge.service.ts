import {Injectable, signal} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {backendUrl} from "../../constants";
import {ChallengeCreationResponse} from "../../model/interface/challengeCreationResponse";
import {Opponent} from "../../model/opponent";

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {

  opponentUserId = signal('')
  opponentUserInfo = signal(new Opponent(0, '', '', ''))

  constructor(
    public httpClient: HttpClient
  ) { }

  async getOpponentUserId(userId: string) {
    if(this.opponentUserId() === ''){
      this.opponentUserId.set(await firstValueFrom(this.httpClient.get<string>(`${backendUrl}/api/challenge/${userId}/opponent-user-id/`)))
    }
    return this.opponentUserId()
  }


  async getOpponentUserInfo(opponentUserId: string): Promise<Opponent>{
    if(this.opponentUserInfo().id===0){
      const sanitizedId = sanitizeString(opponentUserId)
      const response = (await firstValueFrom(this.httpClient.get<any>(`${backendUrl}/api/users/${sanitizedId}/opponent`))).data
      this.opponentUserInfo.set(response)
    }
    return this.opponentUserInfo()
  }

  async createChallenge(userId: string, opponentUserId: string) {
    return await firstValueFrom((this.httpClient.post<number>(`${backendUrl}/api/challenge/`, {
      playerOne:  userId, playerTwo:  opponentUserId
    })))
  }

  async createOnePlayerChallenge(userId: string, opponentUserId: string): Promise<ChallengeCreationResponse> {
   this.opponentUserId.set(opponentUserId)
   return await firstValueFrom((this.httpClient.post<ChallengeCreationResponse>(`${backendUrl}/api/challenge/one-player`, {
     playerOne:  userId, playerTwo:  opponentUserId
   })))
  }

  async checkInProgressChallenge(userId: string): Promise<string> {
    return await firstValueFrom((this.httpClient.get<string>(`${backendUrl}/api/challenge/check-in-progress-challenge/${userId}`)))
  }

  async deleteAllInProgressChallenges(userId: string): Promise<string>{
    return await firstValueFrom((this.httpClient.delete<string>(`${backendUrl}/api/challenge/delete-all-in-progress-challenges/${userId}`)))
  }


}

function sanitizeString(text: string){
  let stringWithoutQuotes = decodeURIComponent(text);

  if (stringWithoutQuotes.startsWith('"') && stringWithoutQuotes.endsWith('"')) {
    stringWithoutQuotes = stringWithoutQuotes.slice(1, -1);
  }
  return stringWithoutQuotes
}

