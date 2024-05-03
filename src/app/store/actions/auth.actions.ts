import {Action} from "@ngrx/store";

export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'


export class Login implements Action {
  readonly type = LOGIN

  constructor(public payload: {
    id: string,
    name: string,
    email: string,
    photo: string,
    avgVictories: number,
    _token?: string,
    _tokenExpirationDate?: Date}) { }
}


export class Logout implements Action {
  readonly type = LOGOUT

  constructor() { }
}

export type AuthActions = Login | Logout
