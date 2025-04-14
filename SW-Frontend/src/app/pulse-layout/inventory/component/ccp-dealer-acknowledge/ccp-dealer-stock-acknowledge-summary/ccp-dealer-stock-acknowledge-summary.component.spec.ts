import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcpDealerStockAcknowledgeSummaryComponent } from './ccp-dealer-stock-acknowledge-summary.component';

describe('CcpDealerStockAcknowledgeSummaryComponent', () => {
  let component: CcpDealerStockAcknowledgeSummaryComponent;
  let fixture: ComponentFixture<CcpDealerStockAcknowledgeSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CcpDealerStockAcknowledgeSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CcpDealerStockAcknowledgeSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
