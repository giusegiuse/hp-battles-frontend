import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
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
import {DiceComponent} from "../dice/dice.component";
import {NgbdModalConfirmComponent} from "../ngbd-modal-confirm/ngbd-modal-confirm.component";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-challenge',
  standalone: true,
  imports: [JsonPipe, CardsPlayerComponent, CardsOpponentComponent, NgOptimizedImage, DiceComponent, NgbdModalConfirmComponent],
  templateUrl: './challenge.component.html',
  styleUrl: './challenge.component.scss'
})
export class ChallengeComponent implements OnInit {

  private destroyRef = inject(DestroyRef)
  characters: Character[] = []
  opponentCharacters: Character[] = []
  charactersStore = inject(CharactersStore)
  isLoggedInSubscription?: Subscription
  userInfo : User | undefined
  opponentUserInfo: Opponent | undefined
  rollDice: boolean = false
  modalRef: NgbModalRef | undefined

  titleChallengeEnd = signal( '')
  messageChallengeEnd = signal('')
  userName = signal('')
  userPhoto = signal(' ')
  opponentPhoto = signal('')
  opponentUserName = signal('')

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private challengeService: ChallengeService,
    public modalService: NgbModal,
  ){}

  ngOnInit() {
    this.loadCharacters(this.authenticationService.userId!).then(characters => {
      this.characters = characters;
    }).catch(error => {
      console.error("Error loading characters:", error);
    });
    this.challengeService.getOpponentUserId(this.authenticationService.userId!).then(userId => {
      this.challengeService.getOpponentUserInfo(userId).then(opponentUserInfo => {
        //TODO Refactor handle of opponentUserInfo
        this.opponentUserInfo = opponentUserInfo
        this.opponentPhoto.set(opponentUserInfo.photo)
        this.opponentUserName.set(opponentUserInfo.name)
      })
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

  rollDiceNow(){
    if(this.rollDice) this.rollDice = false
    else this.rollDice = true
  }

  onDiceRolled(number: number) {
    console.log(`Il dado ha mostrato: ${number}`);
    setTimeout(() => {
      this.rollDice = false;
    }, 2000);
  }

  openModal() {
    const modalRef = this.modalService.open(NgbdModalConfirmComponent);
    modalRef.componentInstance.title = this.titleChallengeEnd;
    modalRef.componentInstance.message = this.messageChallengeEnd;

    modalRef.result.then(
      async (result) => {
        //TODO go to homepage
      },
      (reason) => {
      }
    );
    this.destroyRef.onDestroy(() => {
      if(!this.modalRef) return
      this.modalRef.close()
    })
  }
}
