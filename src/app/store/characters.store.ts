import {getState, patchState, signalStore, withHooks, withMethods, withState} from "@ngrx/signals";
import {Character} from "../model/character";
import {inject} from "@angular/core";
import {CharacterService} from "../services/character/character.service";


interface State {
  readonly characters: Character[];
}

const initialState: State = {
  characters: []
};


export const CharactersStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),
  withMethods((store, characterService = inject(CharacterService)) => {
    return {
      async loadAll() {
        if (getState(store).characters.length === 0) {
          const characters = await characterService.getCharacters();
          patchState(store, {characters});
        }
        return getState(store).characters;
      },
    }
  }),
);
