import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcpDealerStockAcknowledgeItemsComponent } from './ccp-dealer-stock-acknowledge-items.component';

describe('CcpDealerStockAcknowledgeItemsComponent', () => {
  let component: CcpDealerStockAcknowledgeItemsComponent;
  let fixture: ComponentFixture<CcpDealerStockAcknowledgeItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CcpDealerStockAcknowledgeItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CcpDealerStockAcknowledgeItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
