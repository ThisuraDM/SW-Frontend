import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcpDealerStockAcknowledgeRequestsComponent } from './ccp-dealer-stock-acknowledge-requests.component';

describe('CcpDealerStockAcknowledgeRequestsComponent', () => {
  let component: CcpDealerStockAcknowledgeRequestsComponent;
  let fixture: ComponentFixture<CcpDealerStockAcknowledgeRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CcpDealerStockAcknowledgeRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CcpDealerStockAcknowledgeRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
