import {
  Component,
  OnInit,
  ElementRef,
  Renderer2,
  AfterViewInit,
  QueryList,
  ViewChildren,
  ViewChild
} from '@angular/core';
import {Character} from "../model/character";
import {Subject, Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {Ability} from "../model/ability";
import {DeckService} from "../services/deck/deck.service";
import {AuthenticationService} from "../services/authentication/authentication.service";
import {AppRoutes} from "../http/app-routes";
import {RoutingService} from "../http/routing.service";


@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss'],
})

export class CharacterComponent implements OnInit, AfterViewInit {
  @ViewChild('money', {read: ElementRef}) valueElement: ElementRef | undefined;
  @ViewChildren('characterCard') characterCards: QueryList<ElementRef> | undefined;

  characters: Character[] = []
  dataSubscription?: Subscription
  selectedCharacters: number[] = [];
  money: number = 500;
  staticAlertClosed = true;
  errorMessage = '';
  _message$ = new Subject<string>();
  public specialAbilities: Ability | undefined;

  constructor(
    private deckService: DeckService,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    public routingService: RoutingService,
    private renderer: Renderer2,

  ) {
    this.specialAbilities = undefined;
  }


  async ngOnInit() {
    this.dataSubscription = this.route.data.subscribe(data => {
      this.characters = data['character'].data.data;
    })
    const userId = this.authenticationService.userId
    if (userId) await this.deckService.createDeck(userId)
  }

  ngAfterViewInit() {
    this.startAnimation();
  }

  getCardBackground(character: Character): string {
    return character.faction === 'good' ? 'linear-gradient(to bottom right, #ffd700, #b8860b)' : 'darkgreen'
  }

  getCardHeaderBackground(character: Character): string {
    return character.faction === 'good' ? 'linear-gradient(to bottom right, #ffd700, #b8860b)' : 'darkgreen'
  }

  startAnimation() {
    if (this.characterCards)
      this.characterCards.forEach((element, index) => {
        setTimeout(() => {
          this.renderer.addClass(element.nativeElement, 'start-animation');
          this.renderer.addClass(element.nativeElement, 'flipped');
        }, 100 * index);
      });
  }

  async toggleSelection(index: number) {
    const selectedIndex = this.selectedCharacters.indexOf(index);
    if (selectedIndex === -1) {
      try {
        if (this.money < this.characters[index].cost) {
          this.animateCard(index)
          this.errorMessage = 'Non hai abbastanza crediti';
          this.staticAlertClosed = false;
          this._message$.next(this.errorMessage);
          setTimeout(() => {
            this.staticAlertClosed = true;
          }, 5000);
          return
        }
        const addCharacterResponse = await this.deckService.addCharacter(this.characters[index]._id)
        if (addCharacterResponse.status === 500) return
        this.selectedCharacters.push(index);
        const oldMoney = this.money
        this.money -= this.characters[index].cost;
        this.animateCounter(this.money, oldMoney);
      } catch (e) {
        console.log(e)
      }
    } else {
      this.selectedCharacters.splice(selectedIndex, 1);
      await this.deckService.removeCharacter(this.characters[index]._id)
      const oldMoney = this.money
      this.money += this.characters[index].cost;
      this.animateCounter(this.money, oldMoney);
    }
  }

  isSelected(index: number): boolean {
    return this.selectedCharacters.includes(index);
  }

  private animateCounter(newMoney: number, oldMoney: number) {
    let counts = setInterval(updated);
    let upto = oldMoney;

    function updated() {
      let count = document.getElementsByClassName("money")[0] as HTMLElement;
      if (count) {
        if (newMoney > oldMoney)
          count.innerHTML = (++upto).toString();
        else if (newMoney < oldMoney)
          count.innerHTML = (--upto).toString();
        if (upto === newMoney) {
          clearInterval(counts);
        }
      } else {
        clearInterval(counts);
      }
    }
  }

  private animateCard(index: number) {
    const card = document.getElementsByClassName("character-card")[index] as HTMLElement;
    if (card) {
      console.log("card");
      card.classList.add("shake");

      card.addEventListener('animationend', () => {
        card.classList.remove("shake");
      }, { once: true });
    }
  }

  protected readonly AppRoutes = AppRoutes;
}
