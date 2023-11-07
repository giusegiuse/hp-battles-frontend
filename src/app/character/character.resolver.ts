import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {CharacterServiceService} from "../services/character-service.service";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class CharacterResolver implements Resolve<any> {

  constructor(
    private characterService: CharacterServiceService
  ) {
  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return await this.characterService.getCharacters().catch(() => {})
  }
}


