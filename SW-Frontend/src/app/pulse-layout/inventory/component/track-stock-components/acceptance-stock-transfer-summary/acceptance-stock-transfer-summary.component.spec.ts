import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptanceStockTransferSummaryComponent } from './acceptance-stock-transfer-summary.component';

describe('AcceptanceStockTransferSummaryComponent', () => {
  let component: AcceptanceStockTransferSummaryComponent;
  let fixture: ComponentFixture<AcceptanceStockTransferSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptanceStockTransferSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptanceStockTransferSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
