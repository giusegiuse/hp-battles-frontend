import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-line-animation',
  templateUrl: './line-animation.component.html',
  standalone: true,
  styleUrls: ['./line-animation.component.scss']
})
export class LineAnimationComponent implements OnInit {
  starsArray: any[] = new Array(50);

  ngOnInit(): void {}
}
