import { Injectable } from '@angular/core';
import {firstValueFrom} from "rxjs";
import {backendUrl} from "../../constants";
import {HttpClient} from "@angular/common/http";
import {AuthenticationService} from "../authentication/authentication.service";
import {User} from "../../model/user";
import {Opponent} from "../../model/opponent";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private readonly httpClient: HttpClient,
    private readonly authenticationService: AuthenticationService
  ) { }



  async getUser(): Promise<User> {
    const userId = this.authenticationService.userId
    if (!userId) throw new Error('User not logged in')
    const res = await firstValueFrom(this.httpClient.get<any>(`${backendUrl}/api/users/me`))
    return res.data.doc
  }

  async getUserInfoById(id: string): Promise<User> {
    const sanitizedId = sanitizeString(id)
    return await firstValueFrom(this.httpClient.get<User>(`${backendUrl}/api/users/${sanitizedId}`))
  }

  async getUserInfo(): Promise<any> {
    let user: User
    try {
      user = await this.getUser()
      return user
    } catch (e) {
      return {}
    }
  }

  async getOpponentUserInfo(opponentUserId: string): Promise<Opponent>{
    const sanitizedId = sanitizeString(opponentUserId)
    return await firstValueFrom(this.httpClient.get<Opponent>(`${backendUrl}/api/users/${sanitizedId}/opponent`))
  }

}

function sanitizeString(text: string){
  let stringWithoutQuotes = decodeURIComponent(text);

  if (stringWithoutQuotes.startsWith('"') && stringWithoutQuotes.endsWith('"')) {
    stringWithoutQuotes = stringWithoutQuotes.slice(1, -1);
  }
  return stringWithoutQuotes
}
