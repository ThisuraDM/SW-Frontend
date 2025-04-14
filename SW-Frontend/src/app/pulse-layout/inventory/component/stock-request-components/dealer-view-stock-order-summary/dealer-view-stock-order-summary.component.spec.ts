import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerViewStockOrderSummaryComponent } from './dealer-view-stock-order-summary.component';

describe('DealerViewStockOrderSummaryComponent', () => {
  let component: DealerViewStockOrderSummaryComponent;
  let fixture: ComponentFixture<DealerViewStockOrderSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealerViewStockOrderSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerViewStockOrderSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
