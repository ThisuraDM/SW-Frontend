import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcViewStockTransferDetailsBcToBcComponent } from './bc-view-stock-transfer-details-bc-to-bc.component';

describe('BcViewStockTransferDetailsBcToBcComponent', () => {
  let component: BcViewStockTransferDetailsBcToBcComponent;
  let fixture: ComponentFixture<BcViewStockTransferDetailsBcToBcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcViewStockTransferDetailsBcToBcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcViewStockTransferDetailsBcToBcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
