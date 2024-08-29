import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Character} from "../../model/character";
import {Ability, AbilityType} from "../../model/ability";
import {InvulnerabilityAbility, Protego} from "../../model/abilities/protection-ability";
import {firstValueFrom} from "rxjs";
import {backendUrl} from "../../constants";
import {CharacterService} from "../character/character.service";
import {CharactersStore} from "../../store/characters.store";
import {ChallengeService} from "../challenge/challenge.service";
import {AuthenticationService} from "../authentication/authentication.service";

@Injectable({
  providedIn: 'root'
})
export class AbilityService {
  userId = this.authenticationService.userId
  charactersStore = inject(CharactersStore)

  // activateAbility(character: Character): void {
  //   character.useAbility();
  // }
  constructor(
    private httpClient: HttpClient,
    private characterService: CharacterService,
    private challengeService: ChallengeService,
    private authenticationService: AuthenticationService,

  ) {}

  //
  // getAbility(type: AbilityType, name: string, ...args: any[]): Ability {
  //   switch (type) {
  //     case AbilityType.Protection:
  //       if (name === 'Protego') {
  //         return new Protego(args[0]);
  //       }
  //       return new InvulnerabilityAbility(name, args[0], args[1]);
  //     case AbilityType.Poison:
  //       return new DamageAbility(args[0]);
  //     default:
  //       throw new Error('Tipo di abilità sconosciuto');
  //   }
  // }

  async blockCharacter(turnsBlocked: number){
    const opponentCharacterSelectedId = this.characterService.opponentCharacterSelected()
    if(!this.userId){
      return
    }
    const opponentUserId = await this.challengeService.getOpponentUserId(this.userId)
    this.charactersStore.blockCharacter(opponentCharacterSelectedId, turnsBlocked)
    await this.blockCharacterUpdateDB(opponentUserId, opponentCharacterSelectedId, turnsBlocked)
  }

  async blockCharacterUpdateDB(opponentUserId: string, characterId: string, turnsBlocked: number) {

    await firstValueFrom(this.httpClient.post(`${backendUrl}/api/ability/block`, {
      characterId,
      opponentUserId,
      turnsBlocked,
    }))
  }


}

