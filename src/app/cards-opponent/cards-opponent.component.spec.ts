import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsOpponentComponent } from './cards-opponent.component';

describe('OpponentCardComponent', () => {
  let component: CardsOpponentComponent;
  let fixture: ComponentFixture<CardsOpponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardsOpponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardsOpponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
