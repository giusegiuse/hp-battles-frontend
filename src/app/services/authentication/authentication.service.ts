import {Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {BehaviorSubject, firstValueFrom, Observable, Subject} from "rxjs";
import {backendUrl} from "../../constants";
import {CookieService} from 'ngx-cookie-service';
import { v4 as uuidv4 } from 'uuid'
import {CaptchaService} from "./captcha.service";

const tokenKey = 'hptoken'
const cookiesExpirationDays = 365
const sessionUserTokenKey = 'session_user_token'
const userIdKey = 'user_id'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private readonly isLoggedInSubject: BehaviorSubject<boolean>
  user = new Subject()
  private tokenExpirationTimer: any;

  constructor(private httpClient: HttpClient,
              private readonly cookieService: CookieService,
              private readonly captchaService: CaptchaService,
  ) {
    const isLoggedIn = this.isLoggedIn
    this.isLoggedInSubject = new BehaviorSubject<boolean>(isLoggedIn)

  }

  get token(): string | undefined {
    return this.cookieService.get(tokenKey)
  }

  get userId(): string | undefined {
    return this.cookieService.get(userIdKey)
  }

  get isLoggedInObservable(): Observable<boolean> {
    return this.isLoggedInSubject
  }


  async signup(email: string, password: string) {
  }

  async login(email: string, password: string) {
    const captchaToken = await this.captchaService.newCaptchaToken('login')

    let response
    try {
      response = await firstValueFrom(this.httpClient.post<any>(`${backendUrl}/api/users/login`, {
        email: email, password: password, captchaToken

      }))
    } finally {
      this.setCookies(response)
    }
    return (JSON.stringify(response.data.user._id))
  }


  private setCookies(response: any) {
    const options = {expires: cookiesExpirationDays, path: '/', secure: true}
    this.cookieService.set(tokenKey, response.token, options)
    if (response.data.user._id) {
      this.cookieService.set(userIdKey, String(response.data.user._id), options)
    }
  }

  get isLoggedIn(): boolean {
    return !!this.token
  }

  logOut() {
    this.cookieService.delete(tokenKey)
    this.cookieService.delete(userIdKey)
    if(this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer)
    }
    this.tokenExpirationTimer = null
  }

  async forgotPassword(email: string) {
    const captchaToken = await this.captchaService.newCaptchaToken('forgotPassword')
    await firstValueFrom(this.httpClient.post<string>(`${backendUrl}/api/auth/forgot-password`, {email, captchaToken}))
  }

  get sessionUserToken(): string {
    let sessionUserToken = this.cookieService.get(sessionUserTokenKey)
    if (!sessionUserToken) {
      sessionUserToken = uuidv4()
      this.cookieService.set(sessionUserTokenKey, sessionUserToken, {path: '/', secure: true})
    }
    return sessionUserToken
  }

}

