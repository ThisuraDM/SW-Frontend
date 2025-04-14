import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReinstareRechargeCardDetailSumaryComponent } from './reinstate-recharge-card-detail-summary.component';

describe('ReinstareRechargeCardDetailSumaryComponent', () => {
  let component: ReinstareRechargeCardDetailSumaryComponent;
  let fixture: ComponentFixture<ReinstareRechargeCardDetailSumaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReinstareRechargeCardDetailSumaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReinstareRechargeCardDetailSumaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
