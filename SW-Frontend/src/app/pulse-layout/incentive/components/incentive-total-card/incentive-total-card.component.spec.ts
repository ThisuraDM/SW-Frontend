import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentiveTotalCardComponent } from './incentive-total-card.component';

describe('IncentiveTotalCardComponent', () => {
  let component: IncentiveTotalCardComponent;
  let fixture: ComponentFixture<IncentiveTotalCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncentiveTotalCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncentiveTotalCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
