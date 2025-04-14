import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcknowledgeStockTransferComponent } from './acknowledge-stock-transfer.component';

describe('AcknowledgeStockTransferComponent', () => {
  let component: AcknowledgeStockTransferComponent;
  let fixture: ComponentFixture<AcknowledgeStockTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcknowledgeStockTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcknowledgeStockTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
