import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom, Subject} from "rxjs";
import {backendUrl} from "../../constants";
import {CookieService} from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  user = new Subject()

  constructor(private httpClient: HttpClient,
              private readonly cookieService: CookieService
  ) {
  }


  async signup(email: string, password: string) {
  }

  async login(email: string, password: string) {
    let response
    try {
      response = await firstValueFrom(this.httpClient.post<any>(`${backendUrl}/api/users/login`, {
        email: email, password: password
      }))
    } finally {
      console.log(JSON.stringify(response))
      //this.cookieService.set(response)
    }


  }

}

