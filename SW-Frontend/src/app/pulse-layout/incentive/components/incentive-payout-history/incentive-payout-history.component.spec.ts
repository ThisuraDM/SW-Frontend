import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentivePayoutHistoryComponent } from './incentive-payout-history.component';

describe('IncentivePayoutHistoryComponent', () => {
  let component: IncentivePayoutHistoryComponent;
  let fixture: ComponentFixture<IncentivePayoutHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncentivePayoutHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncentivePayoutHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
