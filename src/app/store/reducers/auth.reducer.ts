import {State} from "../app.states";
import * as AuthActions from "../actions/auth.actions";
import {User} from "../../model/user";




const initialState: State = {
  user: null
};

export function authReducer(state: State = initialState, action: AuthActions.AuthActions): State {
    switch (action.type) {
      case AuthActions.LOGIN:
        const user = new User(action.payload.id, action.payload.name,
          action.payload.email, action.payload.photo, action.payload.avgVictories,
          action.payload._token, action.payload._tokenExpirationDate);
        return {
          ...state,
          user: user
        };
      case AuthActions.LOGOUT:
        return {
         ...state,
          user: null
        };
      default:
        return state;
    }
}
