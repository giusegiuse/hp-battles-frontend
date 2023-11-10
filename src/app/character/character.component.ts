import {Component, OnInit, ElementRef, Renderer2, AfterViewInit, QueryList, ViewChildren} from '@angular/core';
import {Character} from "../model/character";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss'],
})

export class CharacterComponent implements OnInit, AfterViewInit {
  @ViewChildren('characterCard') characterCards: QueryList<ElementRef> | undefined;

  characters: Character[] = []
  dataSubscription?: Subscription


  constructor(
    private route: ActivatedRoute,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.dataSubscription = this.route.data.subscribe(data => {
      this.characters = data['character'].data.data;
    })
  }

  ngAfterViewInit() {
    this.startAnimation();
  }


  startAnimation() {
    if(this.characterCards)
    this.characterCards.forEach((element, index) => {
      setTimeout(() => {
        this.renderer.addClass(element.nativeElement, 'start-animation');
      }, 100 * index);
    });
  }


}
