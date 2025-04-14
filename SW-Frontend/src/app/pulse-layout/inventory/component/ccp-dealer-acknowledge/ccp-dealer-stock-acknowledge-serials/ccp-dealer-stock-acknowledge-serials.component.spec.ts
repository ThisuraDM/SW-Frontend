import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcpDealerStockAcknowledgeSerialsComponent } from './ccp-dealer-stock-acknowledge-serials.component';

describe('CcpDealerStockAcknowledgeSerialsComponent', () => {
  let component: CcpDealerStockAcknowledgeSerialsComponent;
  let fixture: ComponentFixture<CcpDealerStockAcknowledgeSerialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CcpDealerStockAcknowledgeSerialsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CcpDealerStockAcknowledgeSerialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
