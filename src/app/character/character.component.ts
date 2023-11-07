import { Component, OnInit } from '@angular/core';
import {Character} from "../model/character";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss']
})
export class CharacterComponent implements OnInit {

  characters: Character[] = []
  dataSubscription?: Subscription

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.dataSubscription = this.route.data.subscribe(data => {
      this.characters = data['character'].data.data;
    })
  }

}
