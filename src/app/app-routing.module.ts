import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SignupComponent} from "./signup/signup.component";
import {LoginComponent} from "./login/login.component";
import {HomeComponent} from "./home/home.component";
import {CharacterComponent} from "./character/character.component";
import {CharacterResolver} from "./character/character.resolver";
import {AppRoutes} from "./http/app-routes";
import {AuthenticationGuard} from "./account/authentication.guard";
import {ResetPasswordComponent} from "./reset-password/reset-password.component";
import {ForgotPasswordComponent} from "./forgot-password/forgot-password.component";
import {UsersOnlineComponent} from "./users-online/users-online.component";
import {ChallengeComponent} from "./challenge/challenge.component";
import {ChallengeResolver} from "./challenge/challenge-resolver";

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthenticationGuard]},
  { path: 'signup', component: SignupComponent},
  { path: 'signup', loadComponent: () => import('./signup/signup.component').then((mod) => mod.SignupComponent)},
  { path: 'login', component: LoginComponent},
  { path: 'reset-password', component: ResetPasswordComponent},
  { path: 'forgot-password', component: ForgotPasswordComponent},
  { path: 'users-online', component: UsersOnlineComponent, canActivate: [AuthenticationGuard]},
  { path: AppRoutes.Challenge, component: ChallengeComponent, resolve: {character: ChallengeResolver}, canActivate: [AuthenticationGuard]},
  { path: `${AppRoutes.Character}/:challengeId`, component: CharacterComponent, resolve: {character: CharacterResolver}, canActivate: [AuthenticationGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
