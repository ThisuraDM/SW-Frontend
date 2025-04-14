import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentivePayoutTrendComponent } from './incentive-payout-trend.component';

describe('IncentivePayoutTrendComponent', () => {
  let component: IncentivePayoutTrendComponent;
  let fixture: ComponentFixture<IncentivePayoutTrendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncentivePayoutTrendComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncentivePayoutTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
