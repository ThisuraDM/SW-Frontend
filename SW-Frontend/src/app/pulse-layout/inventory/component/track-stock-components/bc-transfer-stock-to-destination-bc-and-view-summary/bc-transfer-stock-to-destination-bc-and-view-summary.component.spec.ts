import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcTransferStockToDestinationBcAndViewSummaryComponent } from './bc-transfer-stock-to-destination-bc-and-view-summary.component';

describe('BcTransferStockToDestinationBcAndViewSummaryComponent', () => {
  let component: BcTransferStockToDestinationBcAndViewSummaryComponent;
  let fixture: ComponentFixture<BcTransferStockToDestinationBcAndViewSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcTransferStockToDestinationBcAndViewSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcTransferStockToDestinationBcAndViewSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
