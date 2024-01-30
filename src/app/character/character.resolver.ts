import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import {CharacterService} from "../services/character/character.service";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class CharacterResolver  {

  constructor(
    private characterService: CharacterService
  ) {
  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return await this.characterService.getCharacters().catch(() => {})
  }
}


