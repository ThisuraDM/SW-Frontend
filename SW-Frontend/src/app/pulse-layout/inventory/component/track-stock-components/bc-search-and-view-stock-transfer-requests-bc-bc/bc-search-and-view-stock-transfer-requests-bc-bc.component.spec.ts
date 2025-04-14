import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcSearchAndViewStockTransferRequestsBcBcComponent } from './bc-search-and-view-stock-transfer-requests-bc-bc.component';

describe('BcSearchAndViewStockTransferRequestsBcBcComponent', () => {
  let component: BcSearchAndViewStockTransferRequestsBcBcComponent;
  let fixture: ComponentFixture<BcSearchAndViewStockTransferRequestsBcBcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcSearchAndViewStockTransferRequestsBcBcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcSearchAndViewStockTransferRequestsBcBcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
