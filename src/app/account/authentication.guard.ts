import {Injectable} from "@angular/core";
import {Router, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import {AuthenticationService} from "../services/authentication/authentication.service";


@Injectable({providedIn: 'root'})
export class AuthenticationGuard {

  constructor(private readonly authenticationService: AuthenticationService,
               private readonly router: Router) {

  }

  canActivate(): | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
     if(!this.authenticationService.isLoggedIn){
       this.router.navigate(['/login']);
       return false;
     }
    return this.authenticationService.isLoggedIn
  }

}
