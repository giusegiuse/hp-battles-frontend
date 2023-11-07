import { NgModule } from '@angular/core';
import {Route, RouterModule, Routes} from '@angular/router';
import {SignupComponent} from "./signup/signup.component";
import {LoginComponent} from "./login/login.component";
import {HomeComponent} from "./home/home.component";
import {CharacterComponent} from "./character/character.component";
import {CharacterResolver} from "./character/character.resolver";
import {AppRoutes} from "./http/app-routes";

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'login', component: LoginComponent},
  { path: AppRoutes.Character, component: CharacterComponent, resolve: {character: CharacterResolver}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
