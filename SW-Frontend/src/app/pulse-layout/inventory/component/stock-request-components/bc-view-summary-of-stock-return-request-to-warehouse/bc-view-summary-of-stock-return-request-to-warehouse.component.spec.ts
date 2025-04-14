import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcViewSummaryOfStockReturnRequestToWarehouseComponent } from './bc-view-summary-of-stock-return-request-to-warehouse.component';

describe('BcViewSummaryOfStockReturnRequestToWarehouseComponent', () => {
  let component: BcViewSummaryOfStockReturnRequestToWarehouseComponent;
  let fixture: ComponentFixture<BcViewSummaryOfStockReturnRequestToWarehouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcViewSummaryOfStockReturnRequestToWarehouseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcViewSummaryOfStockReturnRequestToWarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
