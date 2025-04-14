import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentivePayoutTrendsListComponent } from './incentive-payout-trends-list.component';

describe('IncentivePayoutTrendsListComponent', () => {
  let component: IncentivePayoutTrendsListComponent;
  let fixture: ComponentFixture<IncentivePayoutTrendsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncentivePayoutTrendsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncentivePayoutTrendsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
