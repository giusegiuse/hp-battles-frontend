import {getState, patchState, signalStore, withMethods, withState} from "@ngrx/signals";
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
        const myDeckCharacters = await deckService.getDeckCharacters(userId);
        patchState(store, {myDeckCharacters});
        return getState(store).myDeckCharacters;
      },
      async loadOpponentCharactersDeck(userId: string) {
        const opponentDeckCharacters = await deckService.getOpponentDeckCharacters(userId);
        patchState(store, {opponentDeckCharacters});
        return getState(store).opponentDeckCharacters;
      },
      async getMyCharacterById(characterId: string) {
        const state = getState(store);
        return state.myDeckCharacters.find(character => character._id === characterId) || null;
      },
      async getOpponentCharacterById(characterId: string) {
        const state = getState(store);
        return state.opponentDeckCharacters.find(character => character._id === characterId) || null;
      },
      async getMyDeckCharacters() {
        const state = getState(store);
        return state.myDeckCharacters;
      },
      async getOpponentDeckCharacters() {
        const state = getState(store);
        return state.opponentDeckCharacters;
      },
      updateOpponentCharacterLife(characterId: string, newLife: number) {
        const state = getState(store);
        const character = state.opponentDeckCharacters.find(character => character._id === characterId);
        if (character) {
          const updatedCharacters = state.opponentDeckCharacters.map(character =>
            character._id === characterId ? {...character, currentLife: newLife, life: newLife} : character
          );
          patchState(store, {opponentDeckCharacters: updatedCharacters});
        }
      },
      blockCharacter(characterId: string, turnsBlocked: number){
        const state = getState(store);
        const character = state.opponentDeckCharacters.find(character => character._id === characterId);
        if (character) {

        }
      },
      getOpponentCharactersUpdatedLife(characterId: string){
        const state = getState(store);
        const character = state.opponentDeckCharacters.find(character => character._id === characterId);
        if (character) {
          return character.currentLife
        }
        return 0
      }
    }
  }),
);
