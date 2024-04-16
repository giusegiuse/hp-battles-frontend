import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {AppRoutes} from "./app-routes";

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  constructor(private readonly router: Router) { }

public get challenge(){
  return `/${AppRoutes.Challenge}`;
}

}
