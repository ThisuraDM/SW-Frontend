import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcAcknowledgeStockTransferByItemComponent } from './bc-acknowledge-stock-transfer-by-item.component';

describe('BcAcknowledgeStockTransferByItemComponent', () => {
  let component: BcAcknowledgeStockTransferByItemComponent;
  let fixture: ComponentFixture<BcAcknowledgeStockTransferByItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcAcknowledgeStockTransferByItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcAcknowledgeStockTransferByItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
