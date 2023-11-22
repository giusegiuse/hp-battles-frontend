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
  selectedCharacters: number[] = [];

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

  getCardBackground(character: Character): string {
    return character.faction === 'good' ? 'url("https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/hogwarts-gryffindor-pattern-7-black-gryphon.jpg")' :
      'url("https://render.fineartamerica.com/images/rendered/default/print/8/8/break/images/artworkimages/medium/3/hogwarts-slytherin-pattern-3-black-gryphon.jpg")';
  }

  getCardHeaderBackground(character: Character): string {
    return character.faction === 'good' ? 'linear-gradient(to bottom right, #ffd700, #b8860b)' : 'darkgreen'
  }

  startAnimation() {
    if(this.characterCards)
    this.characterCards.forEach((element, index) => {
      setTimeout(() => {
        this.renderer.addClass(element.nativeElement, 'start-animation');
        this.renderer.addClass(element.nativeElement, 'flipped');
      }, 100 * index);
    });
  }

  toggleSelection(index: number) {
    const selectedIndex = this.selectedCharacters.indexOf(index);
    if (selectedIndex === -1) {
      this.selectedCharacters.push(index);
    } else {
      this.selectedCharacters.splice(selectedIndex, 1);
    }
  }

  isSelected(index: number): boolean {
    return this.selectedCharacters.includes(index);
  }

}
