import {Component, OnInit, signal} from '@angular/core';
import {Subscription} from "rxjs";
import {AuthenticationService} from "../services/authentication/authentication.service";
import {UserService} from "../services/user/user.service";
import {User} from "../model/user";
import {Router} from "@angular/router";

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit{

  isLoggedInSubscription?: Subscription
  userInfo : User | undefined
  userName = signal('')
  userPhoto = signal(' ')

  constructor(
    public readonly authenticationService: AuthenticationService,
    private readonly userService: UserService,
    private readonly router: Router
  ) {
  }

  public ngOnInit() {
    this.isLoggedInSubscription = this.authenticationService.isLoggedInObservable.subscribe(async isLoggedIn => {
      this.userInfo = isLoggedIn ? await this.userService.getUserInfo() : undefined
      this.userName.set(this.userInfo!.name)
      this.userPhoto.set(this.userInfo!.photo)
    })
  }

  public async logout() {
    this.authenticationService.logOut()
    this.router.navigate(['/login']);
  }
}
