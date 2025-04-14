import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcknowledgeStockTransferSummaryComponent } from './acknowledge-stock-transfer-summary.component';

describe('AcknowledgeStockTransferSummaryComponent', () => {
  let component: AcknowledgeStockTransferSummaryComponent;
  let fixture: ComponentFixture<AcknowledgeStockTransferSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcknowledgeStockTransferSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcknowledgeStockTransferSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
