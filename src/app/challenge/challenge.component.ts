import { Component } from '@angular/core';
import {FooterComponent} from "../footer/footer.component";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {Character} from "../model/character";

@Component({
  selector: 'app-challenge',
  standalone: true,
  imports: [FooterComponent],
  templateUrl: './challenge.component.html',
  styleUrl: './challenge.component.scss'
})
export class ChallengeComponent {

  dataSubscription?: Subscription
  characters: Character[] = []

  constructor(
    private route: ActivatedRoute,
  ){}

  ngOnInit() {
    this.dataSubscription = this.route.data.subscribe(data => {
      this.characters = data['character'].data.data;
    })

  }

}
