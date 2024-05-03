import {Injectable} from "@angular/core";
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {Router} from "@angular/router";

class Actions {
}

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthenticationService,
    private router: Router
  ) {
  }
}
