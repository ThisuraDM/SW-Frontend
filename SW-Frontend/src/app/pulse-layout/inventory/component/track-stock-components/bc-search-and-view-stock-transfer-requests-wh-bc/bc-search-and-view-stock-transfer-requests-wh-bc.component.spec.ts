import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcSearchAndViewStockTransferRequestsWhBcComponent } from './bc-search-and-view-stock-transfer-requests-wh-bc.component';

describe('BcSearchAndViewStockTransferRequestsWhBcComponent', () => {
  let component: BcSearchAndViewStockTransferRequestsWhBcComponent;
  let fixture: ComponentFixture<BcSearchAndViewStockTransferRequestsWhBcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcSearchAndViewStockTransferRequestsWhBcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcSearchAndViewStockTransferRequestsWhBcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
