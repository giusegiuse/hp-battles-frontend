import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsPlayerComponent } from './cards-player.component';

describe('CardComponent', () => {
  let component: CardsPlayerComponent;
  let fixture: ComponentFixture<CardsPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardsPlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardsPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
