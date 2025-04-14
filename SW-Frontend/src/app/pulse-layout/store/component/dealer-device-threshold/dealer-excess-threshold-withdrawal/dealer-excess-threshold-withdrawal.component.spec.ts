import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerExcessThresholdWithdrawalComponent } from './dealer-excess-threshold-withdrawal.component';

describe('DealerExcessThresholdWithdrawalComponent', () => {
  let component: DealerExcessThresholdWithdrawalComponent;
  let fixture: ComponentFixture<DealerExcessThresholdWithdrawalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealerExcessThresholdWithdrawalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerExcessThresholdWithdrawalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
