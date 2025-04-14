import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EWalletCashoutSummaryComponent } from './e-wallet-cashout-summary.component';

describe('EWalletCashoutSummaryComponent', () => {
  let component: EWalletCashoutSummaryComponent;
  let fixture: ComponentFixture<EWalletCashoutSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EWalletCashoutSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EWalletCashoutSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
