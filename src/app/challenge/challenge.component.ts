import {Component, DestroyRef, ElementRef, inject, OnInit, signal, ViewChild} from '@angular/core';
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
import {LineAnimationComponent} from "../animations/line-animation/line-animation.component";
import {Router} from "@angular/router";
import {AppRoutes} from "../http/app-routes";
import {Lightning, Vector} from "../animations/lightning/lightning";

@Component({
  selector: 'app-challenge',
  standalone: true,
  imports: [JsonPipe, CardsPlayerComponent, CardsOpponentComponent, NgOptimizedImage, DiceComponent, NgbdModalConfirmComponent, LineAnimationComponent],
  templateUrl: './challenge.component.html',
  styleUrl: './challenge.component.scss'
})
export class ChallengeComponent implements OnInit {
  @ViewChild(CardsPlayerComponent) playerComponent!: CardsPlayerComponent;
  @ViewChild(CardsOpponentComponent) opponentComponent!: CardsOpponentComponent;
  @ViewChild('lightningCanvas', { static: true }) lightningCanvas!: ElementRef<HTMLCanvasElement>;
  private lightning!: Lightning;

  private destroyRef = inject(DestroyRef)
  characters: Character[] = []
  opponentCharacters: Character[] = []
  charactersStore = inject(CharactersStore)
  isLoggedInSubscription?: Subscription
  userInfo : User | undefined
  opponentUserInfo: Opponent | undefined
  rollDice: boolean = false
  modalRef: NgbModalRef | undefined
  challengeEndedSubscription?: Subscription
  animateAttackLightingSubscription?: Subscription
  challengeEnded : boolean = false

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
    private router: Router,
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
    this.challengeEndedSubscription = this.challengeService.challengeEndedObservable.subscribe(async (challengeEnded) => {
      if (challengeEnded) {
        this.challengeEnded = true
        this.titleChallengeEnd.set('Battaglia completata')
        this.messageChallengeEnd.set('Hai vinto!')
        this.openModal()
      }
    })
    this.animateAttackLightingSubscription = this.challengeService.animateAttackLightingObservable.subscribe(async ({playerCardIndex, opponentCardIndex}) => {
      this.attack(playerCardIndex, opponentCardIndex)
    })
    this.setupLightning();
  }

  async loadCharacters(userId: string): Promise<Character[]> {
    return await this.challengeService.loadCharacters(userId)
  }

  async loadOpponentCharacters(userId: string): Promise<Character[]> {
    return await this.challengeService.loadOpponentCharacters(userId)
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
    const modalRef = this.modalService.open(NgbdModalConfirmComponent, {centered: true});
    modalRef.componentInstance.title = this.titleChallengeEnd();
    modalRef.componentInstance.message = this.messageChallengeEnd();
    modalRef.componentInstance.rejectButtonEnabled = false;

    modalRef.result.then(
      async (result) => {
        await this.router.navigate([AppRoutes.Home]);

      },
      (reason) => {
      }
    );
    this.destroyRef.onDestroy(() => {
      if(!this.modalRef) return
      this.modalRef.close()
    })
  }

  attack(playerCardIndex: number, opponentCardIndex: number): void {
    const playerCardPos = this.playerComponent.getCardPosition(playerCardIndex);
    const opponentCardPos = this.opponentComponent.getCardPosition(opponentCardIndex);
    if (playerCardPos && opponentCardPos) {
      this.createLightning(playerCardPos, opponentCardPos);
    }
  }

  setupLightning() {
    const config = {
      Segments: 50,
      Threshold: 0.5,
      Width: 1,
      Color: 'red',
      Blur: 5,
      BlurColor: 'red',
      Alpha: 1,
      GlowColor: '#000055',
      GlowWidth: 40,
      GlowBlur: 100,
      GlowAlpha: 30
    };
    this.lightning = new Lightning(config);
  }


  createLightning(startPos: DOMRect, endPos: DOMRect): void {
    console.log('createLightning called', startPos, endPos); // Debug log

    const canvas = this.lightningCanvas.nativeElement;
    const context = canvas.getContext('2d')!;
    context.clearRect(0, 0, canvas.width, canvas.height);

    const startX = startPos.left + startPos.width / 2;
    const startY = startPos.top + startPos.height / 2;
    const endX = endPos.left + endPos.width / 2;
    const endY = endPos.top + endPos.height / 2;

    console.log('Coordinates', { startX, startY, endX, endY }); // Debug log

    const from = new Vector(startX, startY, startX, startY);
    const to = new Vector(startX, startY, endX, endY);

    console.log('Drawing lightning from', from, 'to', to); // Debug log

    this.animateLightning(context, from, to, 0);

    setTimeout(() => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }, 1000);
  }

  animateLightning(context: CanvasRenderingContext2D, from: Vector, to: Vector, step: number) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    const totalSteps = 20;
    const dx = (to.X1 - from.X1) / totalSteps;
    const dy = (to.Y1 - from.Y1) / totalSteps;
    const intermediateTo = new Vector(from.X, from.Y, from.X1 + dx * step, from.Y1 + dy * step);

    this.lightning.Cast(context, from, intermediateTo);

    if (step < totalSteps) {
      requestAnimationFrame(() => this.animateLightning(context, from, to, step + 1));
    }
  }
}

