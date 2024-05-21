import {getState, patchState, signalStore, withHooks, withMethods, withState} from "@ngrx/signals";
import {Character} from "../model/character";
import {inject} from "@angular/core";
import {CharacterService} from "../services/character/character.service";
import {DeckService} from "../services/deck/deck.service";


interface State {
  readonly characters: Character[];
  readonly myDeckCharacters: Character[];
  readonly opponentDeckCharacters: Character[];
}

const initialState: State = {
  characters: [],
  myDeckCharacters: [],
  opponentDeckCharacters: []
};


export const CharactersStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),
  withMethods((store, characterService = inject(CharacterService),
               deckService = inject(DeckService)) => {
    return {
      async loadAll() {
        if (getState(store).characters.length === 0) {
          const characters = await characterService.getCharacters();
          patchState(store, {characters});
        }
        return getState(store).characters;
      },
      async loadCharactersDeck(userId: string) {
        const myDeckCharacters  = await deckService.getDeckCharacters(userId);
        patchState(store, {myDeckCharacters });
        return getState(store).myDeckCharacters;
      },
      async loadOpponentCharactersDeck(userId: string) {
        const opponentDeckCharacters = await deckService.getOpponentDeckCharacters(userId);
        patchState(store, {opponentDeckCharacters});
        return getState(store).opponentDeckCharacters;
      }
    }
  }),
);
