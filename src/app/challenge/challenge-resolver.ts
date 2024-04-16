import {ChallengeService} from "../services/challenge/challenge.service";
import {AuthenticationService} from "../services/authentication/authentication.service";


export class ChallengeResolver {

  constructor(
    private challengeService: ChallengeService,
    private authenticationService: AuthenticationService
  ) {}


  async resolve() {
    const userId = this.authenticationService.userId
    if (!userId) throw new Error("Not authenticated")
    return await this.challengeService.getChallengeCharacters(userId).catch(() => {})
  }
}
