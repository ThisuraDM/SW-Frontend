import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcTransferStockViewSummaryComponent } from './bc-transfer-stock-view-summary.component';

describe('BcTransferStockViewSummaryComponent', () => {
  let component: BcTransferStockViewSummaryComponent;
  let fixture: ComponentFixture<BcTransferStockViewSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcTransferStockViewSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcTransferStockViewSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
