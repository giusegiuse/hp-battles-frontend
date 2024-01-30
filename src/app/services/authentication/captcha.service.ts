import { Injectable } from '@angular/core';
import {firstValueFrom} from "rxjs";
import { ReCaptchaV3Service } from 'ng-recaptcha'

@Injectable({
  providedIn: 'root'
})
export class CaptchaService {

  constructor(
    private recaptchaService: ReCaptchaV3Service
  ) { }


  async newCaptchaToken(action: string): Promise<string> {
    return firstValueFrom(this.recaptchaService.execute(action))
  }
}
