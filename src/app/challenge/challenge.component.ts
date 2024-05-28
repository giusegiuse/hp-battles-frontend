import {Component, inject, signal} from '@angular/core';
import {Subscription} from "rxjs";
import {Character} from "../model/character";
import {JsonPipe, NgOptimizedImage} from "@angular/common";
import {CardsPlayerComponent} from "../cards-player/cards-player.component";
import {CharactersStore} from "../store/characters.store";
import {AuthenticationService} from "../services/authentication/authentication.service";
import {CardsOpponentComponent} from "../cards-opponent/cards-opponent.component";
import {User} from "../model/user";
import {UserService} from "../services/user/user.service";
import {Opponent} from "../model/opponent";
import {ChallengeService} from "../services/challenge/challenge.service";

@Component({
  selector: 'app-challenge',
  standalone: true,
  imports: [JsonPipe, CardsPlayerComponent, CardsOpponentComponent, NgOptimizedImage],
  templateUrl: './challenge.component.html',
  styleUrl: './challenge.component.scss'
})
export class ChallengeComponent {
  characters: Character[] = []
  opponentCharacters: Character[] = []
  charactersStore = inject(CharactersStore)
  isLoggedInSubscription?: Subscription
  userInfo : User | undefined
  opponentUserInfo: Opponent | undefined
  userName = signal('')
  userPhoto = signal(' ')

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private challengeService: ChallengeService
  ){}

  ngOnInit() {
    this.loadCharacters(this.authenticationService.userId!).then(characters => {
      this.characters = characters;
    }).catch(error => {
      console.error("Error loading characters:", error);
    });
    this.userService.getOpponentUserInfo(this.challengeService.getOpponentUserId()).then(opponentUserInfo => {
      this.opponentUserInfo = opponentUserInfo
    })
    //Use this.challengeService.getOpponentUserId()
    this.loadOpponentCharacters(this.authenticationService.userId!).then(characters => {
      this.opponentCharacters = characters;
    }).catch(error => {
      console.error("Error loading opponent characters:", error);
    });
    this.isLoggedInSubscription = this.authenticationService.isLoggedInObservable.subscribe(async isLoggedIn => {
      this.userInfo = isLoggedIn ? await this.userService.getUserInfo() : undefined
      this.userName.set(this.userInfo!.name)
      this.userPhoto.set(this.userInfo!.photo)
    })
  }

  async loadCharacters(userId: string): Promise<Character[]> {
    return await this.charactersStore.loadCharactersDeck(userId)
  }

  async loadOpponentCharacters(userId: string): Promise<Character[]> {
    return await this.charactersStore.loadOpponentCharactersDeck(userId)
  }
}
