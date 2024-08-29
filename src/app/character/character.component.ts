import {
  Component,
  OnInit,
  ElementRef,
 inject, signal, viewChild, viewChildren
} from '@angular/core';
import {Character} from "../model/character";
import {BehaviorSubject, Subject} from "rxjs";
import {ActivatedRoute, RouterModule} from "@angular/router";
import {Ability} from "../model/ability";
import {DeckService} from "../services/deck/deck.service";
import {AuthenticationService} from "../services/authentication/authentication.service";
import {AppRoutes} from "../http/app-routes";
import {NgbAlertModule} from "@ng-bootstrap/ng-bootstrap";
import {CharactersStore} from "../store/characters.store";
import {JsonPipe, NgOptimizedImage} from "@angular/common";
import {CardService} from "../services/card/card.service";


@Component({
  selector: 'app-character',
  standalone: true,
  imports: [RouterModule, NgbAlertModule, JsonPipe, NgOptimizedImage],
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss'],
})

export class CharacterComponent implements OnInit {
  moneyElement = viewChild.required<ElementRef<HTMLElement>>('moneyElement')
  characterCards = viewChildren<ElementRef<HTMLElement>>('characterCard')

  charactersStore = inject(CharactersStore)
  characters: Character[] = []
  selectedCharacters: number[] = [];
  money: number = 500;
  staticAlertClosed = true;
  userId = signal('')
  errorMessage = signal('');
  _message$ = new Subject<string>();
  public specialAbilities: Ability | undefined;
  private wasm: any;
  wasmReady = new BehaviorSubject<boolean>(false)

  constructor(
    private deckService: DeckService,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private cardService: CardService
  ) {
    this.specialAbilities = undefined;
    this.loadAnimateCounterWasmModule('assets/wasm/animate_counter_bg.wasm')
  }


  async ngOnInit() {
    let challengeId = this.route.snapshot.paramMap.get('challengeId');
    this.loadCharacters().then(characters => {
      this.characters = characters;
      if(this.authenticationService.userId) this.userId.set(this.authenticationService.userId)
      if (this.userId && challengeId) {
        this.deckService.createDeck(this.userId(), challengeId).then(() => {
        });
      }
    }).catch(error => {
      console.error("Error loading characters:", error);
    });
  }

  async loadCharacters(): Promise<Character[]> {
    return await this.charactersStore.loadAll()
  }

  async loadAnimateCounterWasmModule(url: string) {
    try {
      const response = await fetch(url);
      const bytes = await response.arrayBuffer();
      const results = await WebAssembly.instantiate(bytes);
      this.wasm = results.instance.exports;
      this.wasmReady.next(true);
    } catch (e) {
      console.error('Failed to load WebAssembly module:', e);
    }
  }


  getCardBackground(character: Character): string {
    return this.cardService.getCardBackground(character)
  }

  getCardHeaderBackground(character: Character): string {
    return this.cardService.getCardHeaderBackground(character)
  }


  async toggleSelection(index: number) {
    const selectedIndex = this.selectedCharacters.indexOf(index);
    if (selectedIndex === -1) {
      try {
        if (this.money < this.characters[index].cost) {
          this.animateCard(index)
          this.errorMessage.set('Non hai abbastanza crediti')
          this.staticAlertClosed = false;
          this._message$.next(this.errorMessage());
          setTimeout(() => {
            this.staticAlertClosed = true;
          }, 5000);
          return
        }

        const addCharacterResponse = await this.deckService.addCharacter(this.characters[index]._id, this.userId())
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
    if (!this.moneyElement) return;
    const countElement = this.moneyElement();
    let upto = oldMoney;

    const updateCount = () => {
      upto = this.wasm.animate_counter(upto, newMoney);

      countElement.nativeElement.textContent = upto.toString();
      if (upto === newMoney) {
        clearInterval(interval);
      }
    };

    const interval = setInterval(updateCount, 10);
  }

  private animateCard(index: number) {
    const card = this.characterCards()[index]
    if (card) {
      card.nativeElement.classList.add("shake");

      card.nativeElement.addEventListener('animationend', () => {
        card.nativeElement.classList.remove("shake");
      }, { once: true });
    }
  }

  protected readonly AppRoutes = AppRoutes;
}
